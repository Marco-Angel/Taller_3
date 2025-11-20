# Taller_3

---
## Punto 3

---
### Item 1

¿Qué es Kubernetes?

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
