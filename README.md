# Taller_3

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

En este ultimo item que completa la este tercer punto, se dejo el mismo folder perose crearon dos archivos que son **k8s-deployment.yaml** y **k8s-service.yaml**
para asi poder crear el servicio y crear el deployment en kubernete.
<img width="668" height="215" alt="image" src="https://github.com/user-attachments/assets/66831d41-6eeb-4c8a-a7a8-a54ea53b8916" />






