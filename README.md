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
### Item 2

**¿Compo crear contenedores?**
Desde visual studio code  se crea un folder, en este caso para demostrar el folder se llamara **Ejemplo-Docker**, despeus de hacer lo anterior se selecciona en la parte de arriva **new file**.
En la siguiente imagen se evidencia la creacion de tres archivos donde a cada uno se le hizo el desarrollo de codigo para poder ejecutar el objetivo de este item que es crear contenedores desde docker, ya que la demostración que se desarrollo se basa en conectar jugadores.
<img width="677" height="261" alt="image" src="https://github.com/user-attachments/assets/14e7df77-031f-4148-9c8e-ff890663eefd" />

