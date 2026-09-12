# Ramiro Fischböck

**Desarrollador full-stack. Construyo herramientas internas que se usan todos los días.**

No hago demos. Lo que escribo entra en producción, lo opera gente real y tiene que
funcionar el lunes a la mañana. Trabajo sobre todo en Python y TypeScript, con una
preferencia fuerte por el stack más chico que resuelva el problema.

📍 Buenos Aires, Argentina · Disponible para proyectos freelance y posiciones full-time

---

## En qué estoy

### Plataforma de cobranzas · DASA (Distressed Assets S.A.)

Portal de pagos en producción para las carteras de **Galicia** y **Santander**.
Diseño, desarrollo y mantenimiento completos.

- **Portal de deudores**: informan el pago y suben el comprobante. Un OCR con IA
  extrae y valida el monto contra lo declarado, y marca las discrepancias.
- **Panel de administración**: concilia automáticamente los pagos contra los
  extractos bancarios (tolerancia de monto y fecha, matcheo por DNI/CUIT en la
  descripción), cruza con el CRM de la empresa sobre SQL Server, y arma los lotes
  de rendición al banco.
- **Flujo de estados auditado** de punta a punta: informado → recibido → a rendir
  → rendido, con registro de quién tocó qué.
- Corre 24/7 y lo usa el equipo de operadores todos los días.

*Python (stdlib), SQLite en modo WAL, React por CDN sin build, pyodbc contra SQL
Server, Cloudflare Tunnel.*

### Radar · asistente de trabajo propio

Lee mi casilla por IMAP en **solo lectura**, arma tareas por proyecto, y me habla
por Telegram. La parte interesante no es el chat: es qué pasa cuando le pedís que
haga algo.

- Un modelo extrae del cuerpo del mail **qué te piden de verdad**, con pasos y
  fecha límite — no el asunto, que casi nunca sirve.
- Motor de ejecución con **doble candado**: primero investiga y te manda un plan
  sin tocar nada, y recién ejecuta cuando lo confirmás por chat. Un mail con
  instrucciones escondidas no puede disparar nada.
- **Guard estructural anti-envío**: si algún día alguien agrega código capaz de
  mandar un mail, el sistema se niega a arrancar. No es una promesa en un
  documento, es un chequeo que corre antes de todo.
- **Evals** sobre casos reales, para que cambiar un prompt deje de ser a ojo.

### Herramientas para trabajar con agentes

Lo que me faltaba para confiarle trabajo real a un agente de código:

- Hooks que **bloquean** borrado de archivos, push forzado y commits que arrastran
  credenciales o datos de clientes — no avisan, frenan.
- Un `pstack` para Windows: ver en qué línea está trabado un proceso vivo, sin
  frenarlo. Adivinar cuesta más que mirar.
- Un comando único por proyecto que contesta "¿rompí algo?".

---

## Cómo trabajo

**El stack más chico que funcione.** Sin build, sin frameworks de backend, pocas
dependencias. Menos piezas móviles es menos cosas que se rompen a las 3 de la
mañana, y es lo que permite que alguien más pueda mantenerlo.

**Candados estructurales, no reglas escritas.** Las reglas que se piden por favor
no se cumplen. Si algo no tiene que pasar, el sistema tiene que negarse a hacerlo.

**Máxima visibilidad.** Todo lo que se puede mostrar en la interfaz, se muestra:
contadores, errores en línea, por qué el sistema tomó cada decisión. El usuario
nunca se queda preguntándose qué pasó.

**Los datos no salen de la máquina.** Bases, comprobantes y documentos de clientes
se quedan donde están. Cero servicios de terceros con acceso a información sensible.

---

## Stack

**Backend** Python · SQLite · SQL Server · IMAP · APIs REST
**Frontend** TypeScript · React · PWAs mobile-first
**Integraciones** OCR y extracción con IA · Telegram · WhatsApp · Cloudflare Tunnel
**Herramientas** Git · GitHub Actions · Claude Code

---

## Contacto

📧 **ramafisch@gmail.com**

<sub>La mayoría de mis repositorios son privados porque contienen trabajo de
clientes. Con gusto muestro código y arquitectura en una charla.</sub>

---

<details>
<summary><b>English</b></summary>

Full-stack developer from Argentina. I build internal tools that people use every
day — not demos. Currently maintaining a production debt-collection platform for
two major Argentine banks (AI-powered receipt OCR, automated bank reconciliation,
CRM integration), plus my own work assistant with a gated AI execution engine.

I favor the smallest stack that solves the problem: fewer moving parts, fewer
things that break at 3am. I'm a strong believer in structural guarantees over
written rules — if something must not happen, the system should refuse to do it.

Available for freelance and full-time work.

</details>
