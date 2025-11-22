# Taller_3
Para el desarrollo del sistema se configuró un entorno basado en Python dentro de una Raspberry Pi, aprovechando su capacidad para manejar procesamiento en tiempo real con una cámara conectada. Se instalaron las librerías esenciales como OpenCV, TensorFlow y NumPy, asegurando compatibilidad con la arquitectura ARM. Además, se organizó un dataset propio ubicado en la ruta /home/juan-pablo-pedraza/proyecto_segmentacion/dataset, el cual contiene las tres clases de interés: osciloscopio, multímetro y Raspberry Pi. Este entorno proporcionó la base necesaria para realizar tanto el entrenamiento del modelo como la implementación del algoritmo de segmentación en tiempo real sin saturar el sistema.

<img width="1012" height="672" alt="imagen" src="https://github.com/user-attachments/assets/b5287294-8e93-434c-81cd-eb896c81aef1" />

Para el entrenamiento se construyó un modelo de visión por computadora adaptado específicamente a las tres clases del dataset. El proceso incluyó la carga automática de las imágenes etiquetadas, su escalado, normalización y división entre entrenamiento y validación. Se utilizó una red convolucional liviana diseñada para funcionar eficientemente en la Raspberry Pi, permitiendo un equilibrio entre precisión y rendimiento. El modelo fue entrenado mediante aprendizaje supervisado, ajustando sus parámetros a través de múltiples épocas hasta lograr identificar y clasificar correctamente las tres categorías de dispositivos electrónicos.

```

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models

# ----------------------------
# RUTA DEL DATASET
# ----------------------------
DATASET_PATH = "/home/juan-pablo-pedraza/proyecto_segmentacion/dataset"
IMG_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 15

# ----------------------------
# CARGA DEL DATASET
# ----------------------------
train_datagen = ImageDataGenerator(
    rescale=1/255.0,
    validation_split=0.2,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True
)

train_gen = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training"
)

val_gen = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation"
)

print("\nCLASES DETECTADAS:")
print(train_gen.class_indices)  # Debe mostrar: {'osciloscopio':0, 'multimetro':1, 'raspberry_pi':2}
```


Se integró un proceso de segmentación en color utilizando un enmascaramiento azul en espacio HSV, con el fin de resaltar y aislar los objetos presentes en la escena. Este paso permitió que el modelo se enfoque únicamente en las regiones relevantes, mejorando la fiabilidad de la clasificación. La máscara se aplicó sobre cada frame proveniente de la cámara, limpiando ruido a través de operaciones morfológicas y resaltando contornos. Esto contribuyó a un procesamiento mucho más estable, reduciendo falsos positivos y facilitando que el algoritmo identifique correctamente los dispositivos dentro del área segmentada.

<img width="1012" height="672" alt="imagen" src="https://github.com/user-attachments/assets/e8aab11b-6604-4b9a-a551-d713d8ec21ad" />

El código desarrollado integra en un solo flujo la captura de video, segmentación azul, preprocesamiento de la imagen y predicción del modelo entrenado. Se implementaron técnicas para evitar la apertura repetitiva de ventanas y asegurar que todo el procesamiento ocurra en una única visualización continua. Cada frame capturado se procesa de forma eficiente, sin recargar el sistema, mostrando en pantalla tanto la máscara generada como la predicción del modelo. Este diseño evita saturación de memoria y permite un funcionamiento sostenido en la Raspberry Pi.

```

import cv2
import numpy as np
import tensorflow as tf

# -----------------------------
# CARGAR MODELO
# -----------------------------
MODEL_PATH = "modelo_herramientas.h5"
model = tf.keras.models.load_model(MODEL_PATH)
CLASSES = ["osciloscopio", "multimetro", "raspberry_pi"]
IMG_SIZE = 224

# -----------------------------
# FUNCIÓN PARA CLASIFICAR FRAME
# -----------------------------
def clasificar(frame):
    img = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=0)
    
    pred = model.predict(img, verbose=0)[0]
    index = np.argmax(pred)
    confianza = pred[index]
    
    return CLASSES[index], confianza

# -----------------------------
# SEGMENTACIÓN CON AZUL TRANSPARENTE
# -----------------------------
def segmentar(frame):
    # Convertimos a escala de grises
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # Suavizar para eliminar ruido
    blur = cv2.GaussianBlur(gray, (7, 7), 0)
    # Umbral para segmentar el objeto principal
    _, mask = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    # Invertimos si es necesario (queremos el objeto, no el fondo)
    if np.mean(mask) > 127:
        mask = cv2.bitwise_not(mask)
    
    # Operaciones morfológicas para limpiar la máscara
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    
    # Crear capa azul transparente
    overlay = frame.copy()
    color_azul = [255, 0, 0]  # BGR: Azul
    overlay[mask == 255] = color_azul
    
    # Mezclar con transparencia (alpha blending)
    alpha = 0.4  # 40% de transparencia (ajusta entre 0.0 y 1.0)
    resultado = cv2.addWeighted(frame, 1, overlay, alpha, 0)
    
    # Opcional: Dibujar contorno del objeto
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(resultado, contours, -1, (255, 0, 0), 2)  # Contorno azul
    
    return resultado

# -----------------------------
# CAPTURA DE CÁMARA
# -----------------------------
# Nombre de ventana constante
WINDOW_NAME = "Detección de Herramientas"

# Crear la ventana UNA SOLA VEZ antes del bucle
cv2.namedWindow(WINDOW_NAME, cv2.WINDOW_NORMAL)

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("No se pudo acceder a la cámara.")
    exit()

print("Presiona 'q' para salir.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error al leer frame")
        break
    
    # Clasificar
    clase, conf = clasificar(frame)
    
    # Segmentar con azul transparente
    frame_seg = segmentar(frame)
    
    # Mostrar SOLO el nombre del objeto detectado (en minúsculas)
    texto = clase.replace('_', ' ')
    
    # Agregar fondo semi-transparente al texto para mejor legibilidad
    (text_width, text_height), baseline = cv2.getTextSize(
        texto, cv2.FONT_HERSHEY_SIMPLEX, 1.2, 3
    )
    cv2.rectangle(frame_seg, (15, 10), (25 + text_width, 50 + baseline), 
                  (0, 0, 0), -1)  # Fondo negro
    cv2.rectangle(frame_seg, (15, 10), (25 + text_width, 50 + baseline), 
                  (255, 0, 0), 2)  # Borde azul
    
    # Texto en blanco
    cv2.putText(frame_seg, texto, (20, 45),
                cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 255), 3)
    
    # Mostrar en la MISMA ventana
    cv2.imshow(WINDOW_NAME, frame_seg)
    
    # Verificar si se presionó 'q' O si se cerró la ventana
    key = cv2.waitKey(1) & 0xFF
    if key == ord("q"):
        break
    
    # Verificar si la ventana fue cerrada con la X
    if cv2.getWindowProperty(WINDOW_NAME, cv2.WND_PROP_VISIBLE) < 1:
        break

cap.release()
cv2.destroyAllWindows()

# Asegurar que todas las ventanas se cierren
cv2.waitKey(1)
```


El sistema resultante permite identificar en tiempo real dispositivos como un osciloscopio, un multímetro y una Raspberry Pi dentro de una escena capturada por cámara. Mediante la combinación de segmentación por color y un modelo CNN entrenado con un dataset propio, se logró una solución precisa, ligera y adaptable a entornos educativos o industriales. El proyecto demuestra cómo la visión artificial puede integrarse de forma práctica en hardware de bajo consumo, permitiendo construir herramientas de clasificación visual accesibles y eficientes.

<img width="628" height="472" alt="imagen" src="https://github.com/user-attachments/assets/ec051017-f3f4-4e6b-b3b4-4035904196b7" />

---
## Punto 3

---
### Item 1

#### ¿Qué es Kubernetes?

Kubernetes, también conocido como K8s, es una plataforma de orquestación de contenedores que automatiza el despliegue, la administración, la escalabilidad y la operación del ciclo de vida de aplicaciones en contenedores.
Fue creado por Google a partir de su experiencia administrando cargas masivas y hoy es un proyecto de código abierto administrado por la Cloud Native Computing Foundation (CNCF).
**Características principales:**
-  Automatización del despliegue
    Gestiona la ejecución de contenedores en múltiples nodos sin intervención manual.
- Escalabilidad automática (autoscaling)
    Ajusta el número de contenedores según la demanda.
- Alta disponibilidad
   Redistribuye cargas y reinicia contenedores cuando detecta fallos.
- Actualizaciones continuas (rolling updates)
   Permite actualizar aplicaciones sin dejarlas fuera de servicio.
- Gestión declarativa con YAML
   El administrador define el estado deseado y Kubernetes lo garantiza.
- Balanceo de carga interno
   Reparte el tráfico entre contenedores activos.
-Portabilidad
   Funciona en la nube, en servidores locales y en entornos híbridos.

**Aplicaciones de Kubernetes:**

Kubernetes se utiliza ampliamente en:
- Plataformas de microservicios
- Sistemas de alta disponibilidad
- Aplicaciones empresariales distribuidas
- Implementación de pipelines CI/CD para DevOps
- Procesamiento de datos y sistemas escalables (Spark, Kafka, etc.)
- Administración de servicios en la nube (AWS, Azure, Google Cloud)

**Relación entre Kubernetes y los contenedores:**

Los contenedores (por ejemplo, los creados con Docker) empacan aplicaciones junto con sus dependencias.
Kubernetes no crea contenedores, sino que se encarga de orquestarlos.

-Administra:
La cantidad de contenedores en ejecución
Su ubicación (en qué nodo corren)
Su comunicación
Su recuperación ante fallos
Permite manejar cientos o miles de contenedores de manera automatizada.

 **Referencias**

Cloud Native Computing Foundation. (2023). Kubernetes documentation. https://kubernetes.io/docs/

Google Cloud. (2023). What is Kubernetes? https://cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-overview

Hightower, K., Burns, B., & Beda, J. (2017). Kubernetes: Up and Running. O’Reilly Media.

Red Hat. (2023). Kubernetes basics. https://www.redhat.com/en/topics/containers/what-is-kubernetes

The Linux Foundation. (2022). Introduction to Kubernetes. https://www.linuxfoundation.org

---
## Item 2

**¿Compo crear contenedores?**

---
### Paso 1

Desde visual studio code  se crea un folder, en este caso para demostrar el folder se llamara **Ejemplo-Docker**, despeus de hacer lo anterior se selecciona en la parte de arriva **new file**.
En la siguiente imagen se evidencia la creacion de tres archivos donde a cada uno se le hizo el desarrollo de codigo que se comparte en los archivos de este repositorio para poder ejecutar el objetivo de este item que es crear contenedores desde docker.

<img width="677" height="261" alt="image" src="https://github.com/user-attachments/assets/14e7df77-031f-4148-9c8e-ff890663eefd" />

### Paso 2

<img width="770" height="122" alt="image" src="https://github.com/user-attachments/assets/1d7c3062-110b-4cf4-9605-7844ba6f47f7" />

En esta imagen se evidencia la version de el node y de npm, cabe recalcar que si no se tiene **Node.Js** para visual studio code se debe buscar y descargar la version **LTS** se debe crear una nueva variable desde el dipositivo y pponer la de el node.js, como consiguiente se debe ir al termminal de el visual studio code y se debe installar con el comando queserequiere. Para el NPM se instala con el comando **npm install** debe tenerse encuenta que el node debe estar isntalado para que permita hacer la instalación.

### Paso 3
<img width="1199" height="648" alt="image" src="https://github.com/user-attachments/assets/60bf55b1-1ffc-4fc6-9469-1cc8d7f24d2a" />

En esta imagen se muestra cómo se construyó y ejecutó un contenedor Docker para una aplicación Node.js: primero se creó la imagen usando docker build basándose en node:18-alpine, copiando los archivos necesarios y ejecutando npm install; luego, tras generarse correctamente la imagen juego-multijugador:v1, se inició un contenedor en segundo plano con docker run, asignando el puerto 3000, y nombrándolo test-juego, quedando así la aplicación lista y corriendo dentro de Docker.

---
<img width="800" height="649" alt="image" src="https://github.com/user-attachments/assets/e66267be-7929-4ad0-9af8-afaa0eb38764" />

La imagen muestra la vista de Logs de un contenedor llamado vigilant_ptolemy, donde se indica que el servidor del juego se ha iniciado correctamente en el puerto 3000. También se muestra el identificador del pod asociado y el estado del contenedor, que aparece como Running, lo que confirma que el servicio está activo y funcionando sin errores visibles.

---
<img width="658" height="815" alt="image" src="https://github.com/user-attachments/assets/2c6d6143-5272-4537-99c1-8c7114da937e" />

La interfaz muestra un juego multijugador en funcionamiento, donde se destaca el identificador del pod (b56c3c74633f) y se indica que hay 3 jugadores conectados. La pantalla incluye un botón principal para unirse como jugador y una sección que lista claramente a los usuarios activos dentro de este mismo pod —Jugador-1, Jugador-2 y Jugador-3— mostrando que el sistema de conexión y sincronización entre participantes está funcionando correctamente dentro del entorno desplegado.

---
<img width="800" height="600" alt="image" src="https://github.com/user-attachments/assets/f884ba00-4908-4177-bfde-18a09be89679" />

El contenedor test-juego muestra que el servidor del juego inició correctamente en el puerto 3000 y que el pod activo es b56c3c74633f. En los registros se observa que tres jugadores (Jugador-1, Jugador-2 y Jugador-3) se conectaron exitosamente al pod, incrementando el conteo total de jugadores de 1 a 3 conforme cada uno ingresó. Esto confirma que el sistema multijugador está funcionando, registrando y actualizando correctamente las conexiones en tiempo real dentro del mismo pod.

---
## Item 3

### Paso 1

En este ultimo item que completa la este tercer punto, se dejo el mismo folder perose crearon dos archivos que son **k8s-deployment.yaml** y **k8s-service.yaml**
para asi poder crear el servicio y crear el deployment en kubernete.

<img width="668" height="215" alt="image" src="https://github.com/user-attachments/assets/66831d41-6eeb-4c8a-a7a8-a54ea53b8916" />

### Paso 2

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/19b49fad-83f5-4c07-8e19-d4accb6fe253" />

La imagen muestra el proceso de instalación y configuración de Minikube en Windows usando PowerShell.
Primero se crea el directorio C:\minikube, luego se descarga el archivo minikube.exe desde GitHub usando Invoke-WebRequest. Después se agrega la ruta C:\minikube a la variable de entorno PATH. Finalmente, se verifica la instalación ejecutando:
minikube version → muestra v1.37.0 instalada correctamente.
kubectl version --client → muestra la versión del cliente kubectl (v1.34.1).

### Paso 3

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/918dd694-a14d-4c26-b045-2802ab21e6d0" />

En la imagen se muestra que ejecutaste **minikube start** y el proceso inició correctamente el clúster local de Kubernetes usando Docker como driver. Se descargaron las imágenes necesarias, se configuró la red interna y se habilitaron los addons por defecto. Luego, al ejecutar minikube status, se confirma que todos los componentes principales están funcionando: el control plane, el kubelet, el apiserver y kubeconfig. En resumen, la imagen evidencia que tu entorno de Kubernetes con Minikube quedó instalado y ejecutándose sin problemas.

### Paso 4

<img width="900" height="611" alt="image" src="https://github.com/user-attachments/assets/db63fb19-5194-4d9c-a04b-4883b260eec9" />

En esta imagen se muestra cómo, tras compilar nuevamente la imagen Docker del juego multijugador dentro del entorno de Minikube, se aplican los archivos de configuración k8s-deployment.yaml y k8s-service.yaml para desplegar el contenedor en Kubernetes. Finalmente, se ejecuta el comando minikube service juego-service --url para obtener la URL pública del servicio, aunque aparece una advertencia indicando que, al usar Docker en Windows, la terminal debe permanecer abierta para que el servicio expuesto funcione correctamente.

### Paso 5

<img width="940" height="609" alt="image" src="https://github.com/user-attachments/assets/ef495f9f-8e79-4ddc-adb1-bb27e26f877d" />

La imagen muestra los logs del contenedor que ejecuta Minikube dentro de Docker Desktop, donde se observa el arranque de varios servicios esenciales como Podman, el contenedor del runtime, la API de Podman y el motor de Docker Application Container Engine. También se ve cómo Minikube completa su proceso de inicialización, habilita servicios de seguridad y llega a los objetivos del sistema necesarios para ejecutar contenedores, confirmando que el entorno está funcionando correctamente dentro del clúster local.

### Paso 6

<img width="630" height="600" alt="image" src="https://github.com/user-attachments/assets/315f7cf8-436e-4fd3-957d-4f055139b0f8" />

La imagen muestra la interfaz moderna de un juego multijugador desplegado en Kubernetes, donde se indica claramente el nombre del pod que está atendiendo la sesión (juego-deployment-56758674ff-kxq8h). La pantalla reporta 2 jugadores conectados, permitiendo además unirse mediante el botón “Conectar como Jugador”, destacado en un estilo visual degradado. En la parte inferior, se listan los jugadores activos dentro de este mismo pod, específicamente Jugador-1 y Jugador-2. El diseño general utiliza colores suaves y elementos visuales llamativos, transmitiendo una experiencia ordenada, amigable e intuitiva para el usuario.





