# 🌐 Guía Completa: Obtener un Dominio Personal para tu Proyecto

## 📊 Resumen Ejecutivo

**Tu situación actual:**
- Gastas ~$20/mes en AWS
- Necesitas un dominio personal
- Quieres mantener costos bajos

**Mejor opción:** Comprar dominio en Namecheap/Porkbun + DNS gratis (Cloudflare)
**Costo adicional:** $8-15/año ($0.67-1.25/mes)

---

## 💰 COMPARATIVA DE OPCIONES

### Opción 1: AWS Route 53 ❌ NO RECOMENDADA (CARA)

**Costos:**
- Dominio .com: $12-13/año
- Hosted Zone (DNS): $0.50/mes ($6/año)
- **TOTAL:** ~$19/año ($1.58/mes)

**Ventajas:**
- Todo integrado en AWS
- Fácil configuración si ya usas AWS

**Desventajas:**
- ❌ MÁS CARO que otras opciones
- ❌ Pagas por el DNS mensualmente ($0.50/mes)
- ❌ No incluye protección de privacidad gratis
- ❌ Interfaz compleja para principiantes

**Veredicto:** ❌ No vale la pena, hay opciones más baratas

---

### Opción 2: Namecheap ✅ MUY RECOMENDADA

**Costos:**
- Dominio .com: $9.58/año (primer año)
- Dominio .com: $13.98/año (renovación)
- DNS: GRATIS (incluido)
- Protección WHOIS: GRATIS
- **TOTAL:** $9.58/año ($0.80/mes)

**Ventajas:**
- ✅ MUY BARATO
- ✅ DNS gratis incluido
- ✅ Protección de privacidad GRATIS
- ✅ Interfaz muy fácil de usar
- ✅ Soporte 24/7
- ✅ Transferencia de dominio gratis
- ✅ SSL gratis con Cloudflare

**Desventajas:**
- Ninguna relevante

**Veredicto:** ✅ MEJOR OPCIÓN - Barato y confiable

**Link:** https://www.namecheap.com

---

### Opción 3: Porkbun ✅ LA MÁS BARATA

**Costos:**
- Dominio .com: $8.13/año (primer año)
- Dominio .com: $10.25/año (renovación)
- DNS: GRATIS (incluido)
- Protección WHOIS: GRATIS
- SSL: GRATIS
- **TOTAL:** $8.13/año ($0.68/mes)

**Ventajas:**
- ✅ LA MÁS BARATA DEL MERCADO
- ✅ DNS gratis incluido
- ✅ Protección de privacidad GRATIS
- ✅ SSL gratis incluido
- ✅ Interfaz moderna y simple
- ✅ Sin costos ocultos

**Desventajas:**
- Menos conocida que Namecheap o GoDaddy

**Veredicto:** ✅ EXCELENTE OPCIÓN - La más económica

**Link:** https://porkbun.com

---

### Opción 4: GoDaddy ⚠️ NO RECOMENDADA

**Costos:**
- Dominio .com: $0.99/año (primer año OFERTA)
- Dominio .com: $19.99/año (renovación) 😱
- Protección WHOIS: $9.99/año extra
- **TOTAL:** $29.98/año ($2.50/mes)

**Ventajas:**
- Muy conocida
- Primer año super barato

**Desventajas:**
- ❌ RENOVACIÓN MUY CARA ($20/año)
- ❌ Intentan venderte muchos extras innecesarios
- ❌ Protección WHOIS NO es gratis
- ❌ Interfaz confusa con mucha publicidad

**Veredicto:** ⚠️ Evitar - Es una trampa de precio bajo inicial

---

### Opción 5: Cloudflare Registrar ✅ EXCELENTE OPCIÓN

**Costos:**
- Dominio .com: $10.41/año (precio al costo)
- DNS: GRATIS (ultra rápido)
- Protección WHOIS: GRATIS
- CDN: GRATIS
- SSL: GRATIS
- **TOTAL:** $10.41/año ($0.87/mes)

**Ventajas:**
- ✅ Precio al costo (sin markup)
- ✅ DNS ultra rápido y gratis
- ✅ CDN gratis incluido
- ✅ Protección DDoS gratis
- ✅ Analytics gratis
- ✅ Renovación al mismo precio siempre

**Desventajas:**
- Requiere tarjeta de crédito (no PayPal)
- No vende todos los TLDs

**Veredicto:** ✅ EXCELENTE - Si tienes tarjeta de crédito

**Link:** https://www.cloudflare.com/products/registrar/

---

## 🎯 RECOMENDACIÓN FINAL

### Para tu caso (Proyecto inmobiliaria con $20/mes):

**Opción A: PORKBUN (La más barata)**
- **Costo:** $8.13/año ($0.68/mes)
- **Total proyecto:** $20.68/mes
- **Aumento:** Solo $0.68/mes

**Opción B: NAMECHEAP (Más conocida)**
- **Costo:** $9.58/año ($0.80/mes)
- **Total proyecto:** $20.80/mes
- **Aumento:** Solo $0.80/mes

**Opción C: CLOUDFLARE (Mejor DNS)**
- **Costo:** $10.41/año ($0.87/mes)
- **Total proyecto:** $20.87/mes
- **Aumento:** Solo $0.87/mes

---

## 📋 PASO A PASO: Comprar Dominio (Namecheap)

### Paso 1: Registrarte y Buscar Dominio (5 min)

1. Ir a: https://www.namecheap.com
2. Buscar tu dominio deseado (ej: `mipropiedadeshn.com`)
3. Agregar al carrito
4. **NO comprar extras** (solo el dominio)

### Paso 2: Configurar Protección WHOIS (Gratis)

1. En el checkout, verificar que "WhoisGuard" esté activado (GRATIS)
2. Esto oculta tu información personal

### Paso 3: Completar Compra

1. Crear cuenta en Namecheap
2. Pagar con tarjeta o PayPal
3. **Costo total:** ~$9.58

### Paso 4: Configurar DNS (10 min)

**Opción A: Usar DNS de Namecheap (Más simple)**

1. Ir a Domain List → Manage
2. Advanced DNS
3. Agregar registros:
   ```
   Type: A Record
   Host: @
   Value: 54.147.61.191
   TTL: Automatic

   Type: A Record
   Host: www
   Value: 54.147.61.191
   TTL: Automatic
   ```

**Opción B: Usar Cloudflare DNS (Más rápido - RECOMENDADO)**

1. Crear cuenta en Cloudflare (gratis)
2. Agregar tu dominio
3. Cloudflare te dará 2 nameservers
4. Ir a Namecheap → Domain → Nameservers
5. Cambiar a "Custom DNS"
6. Pegar los nameservers de Cloudflare
7. En Cloudflare, agregar:
   ```
   Type: A
   Name: @
   IPv4: 54.147.61.191
   Proxy: Activado (nube naranja)

   Type: A
   Name: www
   IPv4: 54.147.61.191
   Proxy: Activado (nube naranja)
   ```

**Ventajas de Cloudflare DNS:**
- ✅ Más rápido
- ✅ CDN gratis
- ✅ SSL automático
- ✅ Protección DDoS
- ✅ Analytics

### Paso 5: Esperar Propagación (1-48 horas)

- Normalmente toma 15-30 minutos
- Puedes verificar en: https://dnschecker.org

### Paso 6: Configurar SSL en EC2 (15 min)

```bash
# Conectar a EC2
ssh -i ~/.ssh/inmobiliaria-key.pem ec2-user@54.147.61.191

# Instalar Certbot
sudo yum install certbot python3-certbot-nginx -y

# Editar configuración Nginx
sudo nano /etc/nginx/nginx.conf

# Cambiar server_name:
# server_name _;  ← BORRAR
# server_name tudominio.com www.tudominio.com;  ← AGREGAR

# Guardar y reiniciar Nginx
sudo systemctl restart nginx

# Obtener SSL gratis
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# Seguir instrucciones (acepta términos, ingresa email)
```

**SSL se renovará automáticamente cada 90 días** ✅

---

## 🔄 CONFIGURACIÓN COMPLETA CON CLOUDFLARE (RECOMENDADO)

### Ventajas de usar Cloudflare como DNS:

1. **DNS ultra rápido:** 1.1.1.1 es el DNS público más rápido
2. **CDN gratis:** Tu sitio será más rápido en todo el mundo
3. **SSL automático:** Sin configurar nada en el servidor
4. **Protección DDoS:** Gratis incluido
5. **Analytics:** Ver tráfico y estadísticas
6. **Cache inteligente:** Reduce carga en tu servidor

### Configuración paso a paso:

1. **Comprar dominio en Porkbun/Namecheap:** $8-10/año
2. **Agregar a Cloudflare (gratis):**
   - Crear cuenta en cloudflare.com
   - Agregar dominio
   - Cambiar nameservers en Namecheap/Porkbun
3. **Configurar DNS en Cloudflare:**
   - A @ → 54.147.61.191 (Proxy ON)
   - A www → 54.147.61.191 (Proxy ON)
4. **SSL:**
   - Cloudflare lo hace automático
   - En EC2: Cambiar Nginx server_name
5. **Optimizaciones:**
   - Activar Auto Minify (HTML, CSS, JS)
   - Activar Brotli
   - Cache TTL: 4 horas

---

## 💡 DOMINIOS ALTERNATIVOS (MÁS BARATOS)

Si quieres ahorrar más, considera estas extensiones:

| Extensión | Precio/año | Ejemplo |
|-----------|-----------|---------|
| **.xyz** | $1.50-3 | mipropiedades.xyz |
| **.site** | $3-5 | mipropiedades.site |
| **.online** | $3-5 | mipropiedades.online |
| **.tech** | $5-8 | mipropiedades.tech |
| **.space** | $2-4 | mipropiedades.space |
| **.com** | $8-14 | mipropiedades.com ⭐ |

**Recomendación:** Quédate con **.com** - Es más profesional y reconocible

---

## 📊 COSTO TOTAL DEL PROYECTO CON DOMINIO

### Escenario: Porkbun + Cloudflare DNS

| Servicio | Costo Mensual |
|----------|---------------|
| EC2 t3.small | $15.00 |
| EBS 30GB | $2.50 |
| S3 | $0.50-1.00 |
| OpenAI API | $2.00-5.00 |
| **Dominio (Porkbun)** | **$0.68** |
| **TOTAL** | **$20.68-24.18/mes** |

**Aumento:** Solo $0.68/mes por tener tu dominio personal

---

## 🎯 CHECKLIST DE IMPLEMENTACIÓN

### Pre-compra
- [ ] Decidir nombre del dominio
- [ ] Verificar disponibilidad
- [ ] Elegir proveedor (Porkbun/Namecheap/Cloudflare)

### Compra
- [ ] Crear cuenta en proveedor elegido
- [ ] Comprar dominio
- [ ] Activar protección WHOIS (si aplica)

### Configuración DNS
- [ ] Opción A: Configurar DNS directo en proveedor
- [ ] Opción B: Crear cuenta Cloudflare (RECOMENDADO)
- [ ] Cambiar nameservers a Cloudflare
- [ ] Agregar registros A (@ y www)
- [ ] Esperar propagación (15-30 min)

### Configuración Servidor
- [ ] Editar Nginx server_name
- [ ] Reiniciar Nginx
- [ ] Instalar Certbot (si no usas Cloudflare SSL)
- [ ] Obtener certificado SSL
- [ ] Verificar renovación automática

### Verificación
- [ ] Probar http://tudominio.com
- [ ] Probar https://tudominio.com
- [ ] Probar www.tudominio.com
- [ ] Verificar SSL (candado verde)
- [ ] Probar todas las funcionalidades

---

## 🔧 COMANDOS RÁPIDOS

### Verificar DNS
```bash
# Verificar que apunta a tu IP
dig tudominio.com

# Verificar propagación mundial
# https://dnschecker.org
```

### Actualizar Nginx en EC2
```bash
ssh -i ~/.ssh/inmobiliaria-key.pem ec2-user@54.147.61.191

# Editar configuración
sudo nano /etc/nginx/nginx.conf

# Buscar: server_name _;
# Cambiar por: server_name tudominio.com www.tudominio.com;

# Guardar (Ctrl+X, Y, Enter)

# Verificar configuración
sudo nginx -t

# Reiniciar
sudo systemctl restart nginx
```

### Obtener SSL (si NO usas Cloudflare)
```bash
# Instalar Certbot
sudo yum install certbot python3-certbot-nginx -y

# Obtener certificado
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# Verificar renovación automática
sudo certbot renew --dry-run
```

---

## ❓ PREGUNTAS FRECUENTES

### ¿Necesito Route 53 de AWS?
**NO.** Route 53 es más caro y no ofrece ventajas significativas para tu caso.

### ¿Qué pasa si uso Cloudflare?
Cloudflare actúa como proxy entre usuarios y tu servidor. Ventajas:
- Más rápido
- Más seguro
- SSL gratis
- Cache automático

### ¿El dominio es anual o mensual?
**Anual.** Pagas una vez al año. Algunos proveedores permiten pagar por múltiples años.

### ¿Puedo cambiar de proveedor después?
**Sí.** Puedes transferir tu dominio a otro proveedor después de 60 días.

### ¿Necesito privacidad WHOIS?
**Sí.** Sin esto, tu información personal (email, teléfono) será pública.

---

## 🌟 RECOMENDACIÓN FINAL

Para tu proyecto inmobiliaria:

1. **Compra dominio en Porkbun** ($8.13/año)
2. **Usa Cloudflare como DNS** (gratis)
3. **Aumento mensual:** Solo $0.68/mes
4. **Total mensual:** ~$21/mes (dentro de presupuesto)

**Nombre sugerido:**
- `inmobiliariaortega.com`
- `ventashamiltonortega.com`
- `propiedadesho.com`

---

## 📞 SOPORTE

Si tienes problemas:
- **Namecheap:** Live chat 24/7
- **Cloudflare:** Documentación + Comunidad
- **Porkbun:** Email support (responden rápido)

---

**Última actualización:** 2026-01-28
**Costo promedio dominio .com:** $8-14/año ($0.67-1.17/mes)
