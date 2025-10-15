# 🎨 Guía de Estilos CSS - GreenLedger Protocol

## 📋 Descripción
Este proyecto utiliza un sistema de diseño personalizado enfocado en sostenibilidad y Web3, combinando Tailwind CSS con clases CSS personalizadas.

## 🎯 Tema Principal
- **Colores**: Verde esmeralda, teal, dorado (sostenibilidad)
- **Efectos**: Glass morphism, gradientes suaves, animaciones fluidas
- **Fuente**: Inter (modern, clean)

## 🧩 Componentes CSS Principales

### 1. Tarjetas de Cristal (Glass Cards)
```css
.glass-card
```
- **Uso**: Contenedores principales de componentes
- **Efecto**: Fondo semi-transparente con blur
- **Hover**: Elevación suave

### 2. Botones
```css
.btn-primary    /* Verde esmeralda con gradiente */
.btn-secondary  /* Dorado con gradiente */
.wallet-btn     /* Botón especial para wallet con efecto shimmer */
```

### 3. Indicadores de Estado
```css
.status-connected     /* Verde con brillo */
.status-disconnected  /* Gris neutro */
```

### 4. Tarjetas de Métricas
```css
.metric-card
```
- **Uso**: Mostrar datos y estadísticas
- **Efecto**: Borde izquierdo coloreado
- **Hover**: Cambio de color dinámico

### 5. Indicadores de Progreso
```css
.progress-ring    /* Anillo circular SVG */
.progress-circle  /* Círculo con animación */
```

## 🎭 Animaciones

### Animaciones de Entrada
```css
.animate-fadeInUp      /* Fade in desde abajo */
.animate-slideInRight  /* Desliza desde derecha */
.animate-pulse-slow    /* Pulso suave y lento */
```

### Efectos Especiales
```css
.shimmer          /* Efecto de brillo deslizante */
.text-gradient    /* Texto con gradiente */
.shadow-glow      /* Sombra con brillo verde */
```

## 🌈 Paleta de Colores

### Variables CSS
```css
--primary-green: #10b981
--primary-emerald: #059669  
--primary-teal: #14b8a6
--accent-gold: #f59e0b
--accent-blue: #3b82f6
```

### Gradientes
```css
--gradient-main: Verde suave para fondos
--gradient-emerald: Verde intenso para CTAs
--gradient-gold: Dorado para recompensas
--gradient-glass: Transparencia para glass morphism
```

## 📱 Responsive Design
- **Mobile**: Componentes adaptables automáticamente
- **Tablet**: Grid layouts optimizados
- **Desktop**: Efectos hover y animaciones completas

## 🔧 Uso en Componentes

### Ejemplo WalletConnector
```jsx
<button className="wallet-btn btn-primary px-8 py-4 rounded-xl">
  <span className="text-2xl">🦊</span>
  <span>Conectar MetaMask</span>
</button>
```

### Ejemplo Dashboard Card
```jsx
<div className="glass-card p-8 animate-fadeInUp">
  <div className="metric-card p-6 rounded-2xl">
    <div className="text-3xl font-bold text-gradient">85</div>
  </div>
</div>
```

## 🎨 Clases de Utilidad

### Bordes Redondeados
- `.rounded-xl` - 24px radius
- `.rounded-2xl` - 32px radius

### Sombras
- `.shadow-soft` - Sombra suave
- `.shadow-medium` - Sombra media
- `.shadow-large` - Sombra grande
- `.shadow-glow` - Sombra con brillo

### Efectos de Texto
- `.text-gradient` - Texto con gradiente verde
- `.hero-title` - Título principal con efectos

## 🌙 Dark Mode
Soporte automático para modo oscuro usando CSS media queries.

## 📊 Performance
- Animaciones optimizadas con `transform` y `opacity`
- Uso de `will-change` para animaciones complejas
- Transiciones suaves con `cubic-bezier`

## 🔄 Actualizaciones
Para modificar colores o efectos, editar variables en `:root` del archivo `custom.css`.