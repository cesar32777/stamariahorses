# ADR-0005 — Identidad exclusiva de cuenta para Git y despliegues

- **Fecha:** 2026-09-04
- **Estado:** Aceptada

## Contexto

El proyecto Santa María Performance Horses es un proyecto personal de César Muñiz (`cesarmunizce32`). Previamente, por configuración de entorno heredada en la máquina de desarrollo, se asociaron credenciales de cuentas de terceros/empresariales (`smartshops`, `holasmartshops@gmail.com`, `desarrollo-4632`). Esto generó commits con autoría ajena y advertencias de permisos en Vercel.

## Decisión

1. **Única cuenta autorizada:** Todo commit, interacción con el repositorio de GitHub y configuración de Vercel debe realizarse **exclusivamente** con la cuenta de César Muñiz:
   - Git: `Cesar Muniz <cesarmunizce32@gmail.com>`
   - GitHub: `cesar32777`
   - Vercel: `cesarmunizce32-8387`
2. **Purga total:** Se reescribe la historia de Git para erradicar cualquier registro de correos o usuarios de terceros (`smartshops`, `holasmartshops`).
3. **Desvinculación:** Se cierra sesión de CLI de cuentas no autorizadas (`vercel logout`).
4. **Configuración local fija:** El repositorio debe mantener fijados `user.name` y `user.email` locales a nivel de proyecto para prevenir cualquier uso accidental de configuraciones globales.

## Consecuencias

- Cero mezcla de identidades laborales/terceros con este proyecto.
- Historial de Git 100% atribuido a César Muñiz.
- Vercel reconoce al autor del commit como el dueño legítimo del proyecto.
