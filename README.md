# TechConf – Laboratorio 12: Proyecto Full-Stack Autónomo

**Curso:** IF0009 – Desarrollo de Software IV
**Estudiante:** Daniela Tames Vega
**Carnet:** C5K177
**Semestre:** II-2026



## Cómo ejecutar

Back-End (puerto 8080):


cd techconf-backend
./mvnw spring-boot:run      


Front-End (puerto 4200):


cd techconf-frontend
npm install
ng serve


Abrir `http://localhost:4200`.

## Funcionalidades implementadas

### Back-End
- Entidad Charla con título, expositor, nivel, email, fechas y etiquetas 
- Entidad Asistente con id, nombreCompleto, correo y edad, con validaciones
- data.sql con 3 charlas, sus etiquetas y 5 asistentes distribuidos entre las charlas.
- Endpoints REST

### Front-End
- Formulario de charla con FormBuilder, FormArray dinámico para etiquetas y validador cruzado de fechas (`fechaFin` no puede ser anterior a `fechaInicio`).
- Botón Inscribir Asistente en cada tarjeta de la agenda que despliega un formulario con:
  - nombre: requerido, mínimo 3 caracteres.
  - correo: requerido, formato de email válido.
  - edad: requerida, con el validador personalizado `mayorDe18`.


## Depuración
### Problema
Al crear la relación bidireccional entre Charla y Asistente, se provocó el error intencionalmente quitando la anotación de protección del campo charla en Asistente. El servidor respondió con error 500



### Procedimiento exacto de solución
1. Provoqué el error comentando @JsonIgnore sobre el campo charla de la clase Asistente 
2. Reinicié el backend, consulté GET /api/charlas y capturé el error en una captura
3. Restauré la anotación @JsonIgnore sobre private Charla charla; en Asistente.
4. Reinicié el backend y  volvió a devolver cada charla con su lista de asistentes, sin ciclos.

