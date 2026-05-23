# Loş Odadan Aydınlanan 3D Portfolyo Sitesi — Kurulum Rehberi

Tek sayfalık (single-page), kaydırmasız bir oda sahnesi. Site açıldığında ortam loş;
2 saniye sonra lamba yanıyor ve hem sahne aydınlanıyor hem de portfolyo içeriği görünür hale geliyor.

Teknoloji yığını: **React + Vite + Tailwind CSS + React Three Fiber + drei**

---

## 0. Kurulum

```bash
# Proje (Vite örneği)
npm create vite@latest portfolio -- --template react
cd portfolio

# 3D kütüphaneleri
npm install three @react-three/fiber @react-three/drei

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.js` içine içerik yollarını eklemeyi unutma:

```js
content: ["./index.html", "./src/**/*.{js,jsx}"],
```

---

## 1. Kaydırmaz Ekran (No-Scroll Viewport)

Ana taşıyıcıyı ekranın tam boyutuna sabitliyoruz.

> **Düzeltme:** `w-screen` yerine `w-full` kullan. `w-screen` değeri `100vw`'dir ve
> dikey kaydırma çubuğunun genişliğini de hesaba kattığı için bazı tarayıcılarda
> istenmeyen **yatay** taşma (ve dolayısıyla kayma) yaratabilir.

```jsx
<div className="h-screen w-full overflow-hidden relative bg-black">
  {/* ... */}
</div>
```

Ekstra güvenlik için global CSS'e de bir satır eklemek iyi olur:

```css
html, body, #root {
  margin: 0;
  height: 100%;
  overflow: hidden;
}
```

---

## 2. 3D Sahne ve Modeller

Sahneye GLTF/GLB formatında üç model yerleştirilecek:

- **3'lü koltuk**
- **Oturan adam figürü** — Mixamo'dan animasyonlu ya da statik bir model indirilebilir
- **Lambader / masa lambası** — koltuğun hemen yanında

### Önemli: Modeller `Suspense` ister

`useGLTF` model yüklenirken bileşeni "askıya alır" (suspend). Bu yüzden tüm modeller
mutlaka bir `<Suspense>` sınırı içinde olmalı; aksi halde uygulama çöker.

```jsx
import { useGLTF } from '@react-three/drei';

function SofaModel(props) {
  const { scene } = useGLTF('/models/sofa.glb');
  return <primitive object={scene} {...props} />;
}

// Modeli önceden belleğe al — açılış takılmasını azaltır
useGLTF.preload('/models/sofa.glb');
```

`ManModel` ve `LampModel` da aynı kalıpla yazılır. GLB dosyaları `public/models/`
klasörüne konulmalıdır ki yol `/models/...` ile erişilebilsin.

---

## 3. Işıklandırma ve Zamanlama (Çekirdek Mekanik)

İki tür ışık:

1. **Ambient Light** — Açılışta çok düşük (`0.05`), lamba yanınca `0.3`.
2. **Point Light** — Lambanın ampul koordinatında. Açılışta `0`, 2 saniye sonra yükselir.

### Düzeltilen iki nokta

**a) Yumuşak geçiş çelişkisi.**
Orijinal iskelette `{isLightOn && <pointLight />}` kullanılıyordu. Bu yöntem ışığı
sahneden tamamen kaldırıp geri eklediği için **yumuşak geçiş yapmak imkânsızdır** —
ışık ancak anlık olarak yanar. İstenen "yumuşak geçiş" için ışığı her zaman sahnede
tutup yalnızca `intensity` değerini animasyonla artırmak gerekir.

**b) Gölgeler.**
`castShadow` tek başına yetmez. Gölge için üç şey birlikte gerekir:
`<Canvas shadows>`, ışıkta `castShadow`, ve modellerde `castShadow` / `receiveShadow`.

> **R3F v9 / Three.js notu:** Yeni sürümlerde ışıklandırma fiziksel temelli olduğu için
> `intensity` birimleri değişti ve `pointLight` varsayılan `decay={2}` ile hızla zayıflar.
> Sahnen karanlık kalırsa `intensity` değerini yükselt (örn. `8`–`20`) veya
> `decay={0}` ile klasik davranışa dön.

### Yumuşak geçişli lamba bileşeni

`useFrame` ile her karede `intensity` değerini hedefe doğru `lerp` ederek pürüzsüz
bir geçiş elde ediyoruz (ekstra kütüphaneye gerek yok):

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Lamp({ isLightOn, ...props }) {
  const lightRef = useRef();

  useFrame((_, delta) => {
    if (!lightRef.current) return;
    const target = isLightOn ? 8 : 0; // hedef parlaklık
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      target,
      delta * 3 // geçiş hızı — büyüdükçe daha hızlı
    );
  });

  return (
    <pointLight
      ref={lightRef}
      position={[1.5, 1.5, -1]}   /* ampulün koordinatı */
      intensity={0}
      color="#ffddaa"             /* sıcak sarımsı lamba rengi */
      distance={10}
      decay={2}
      castShadow
      {...props}
    />
  );
}
```

### Ana sahne bileşeni (düzeltilmiş iskelet)

```jsx
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { OrbitControls, Environment } from '@react-three/drei';
// import { SofaModel, ManModel, LampModel, Lamp } from './models';

export default function PortfolioScene() {
  const [isLightOn, setIsLightOn] = useState(false);

  useEffect(() => {
    // Siteye girildikten 2 saniye sonra ışığı aç
    const timer = setTimeout(() => setIsLightOn(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden relative bg-black">

      {/* 3D Canvas — gölgeler için "shadows" prop'u zorunlu */}
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>

        {/* Loş ortam ışığı: lamba yanınca biraz aydınlanır */}
        <ambientLight intensity={isLightOn ? 0.3 : 0.05} />

        {/* Lamba ışığı her zaman sahnede; yalnızca parlaklığı animasyonla değişir */}
        <Lamp isLightOn={isLightOn} />

        {/* Modeller askıya alma yapar -> Suspense şart */}
        <Suspense fallback={null}>
          {/* <SofaModel position={[0, 0, 0]} /> */}
          {/* <ManModel  position={[0, 0, 0]} /> */}
          {/* <LampModel position={[1.5, 0, -1]} /> */}

          {/* Zemin: gölgeyi üzerine almak için receiveShadow */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </Suspense>

        {/* İsteğe bağlı: kullanıcı sahneyi döndürebilsin */}
        <OrbitControls enablePan={false} />

      </Canvas>

      {/* HTML İçerik Katmanı — ışık açılınca görünür */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center
          text-white transition-opacity duration-1000 ${
          isLightOn ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <h1 className="text-5xl font-bold">Kişisel Web Sayfam</h1>
        <p className="mt-4">Yetenekler · Projeler · İletişim</p>
      </div>

    </div>
  );
}
```

Modeller (`SofaModel` vb.) için modeli sahneye basan her bileşene `castShadow` /
`receiveShadow` eklemeyi unutma. `<primitive>` ile yüklenen GLB'lerde mesh'leri
gezip gölge atamak için drei'nin `<Clone>` bileşeni veya sahne içi `traverse`
kullanılabilir.

---

## 4. İçerik Yerleşimi

Yetenekler, projeler ve iletişim bilgisi tek sayfada duracağı için iki yaklaşım var.

### Seçenek A — HTML Overlay (önerilen)

3D Canvas'ın üzerine şeffaf bir HTML katmanı koyup yazıları doğrudan ekranın
kenarlarına yerleştirmek. **En kolay uygulanan ve okunabilirliği en yüksek** yöntem.

```jsx
<div className="absolute inset-0 pointer-events-none">
  <nav className="absolute top-8 right-8 pointer-events-auto text-white">
    {/* Menü / bölümler */}
  </nav>
</div>
```

> İpucu: Dış kapsayıcıya `pointer-events-none`, tıklanması gereken alt öğelere
> `pointer-events-auto` ver. Böylece boş alanlarda fare olayları Canvas'a geçer
> ve `OrbitControls` çalışmaya devam eder.

### Seçenek B — 3D Text

Yazıları HTML yerine doğrudan sahnenin içine, odada asılı 3B objeler olarak koymak.
drei'nin `Text` bileşeni kullanılır:

```jsx
import { Text } from '@react-three/drei';

<Text
  position={[-2, 2, -1]}
  fontSize={0.4}
  color="#ffffff"
  anchorX="center"
  anchorY="middle"
>
  Projeler
</Text>
```

Daha sürükleyici (immersive) görünür ama hizalama, okunabilirlik ve responsive
davranış HTML overlay'e göre daha zahmetlidir.

**Öneri:** Başlık/menü gibi okunması kritik metinler için **HTML Overlay**, odanın
atmosferine katkı sağlayacak dekoratif yazılar için **3D Text** — ikisini birlikte
kullanmak en iyi sonucu verir.

---

## Özet Kontrol Listesi

- [ ] Ana kapsayıcı: `h-screen w-full overflow-hidden relative`
- [ ] `html, body, #root` için `overflow: hidden`
- [ ] `<Canvas shadows>` ayarlandı
- [ ] Modeller `<Suspense>` içinde
- [ ] Lamba ışığı her zaman sahnede, `intensity` `useFrame` ile lerp'leniyor
- [ ] Işıkta `castShadow`, zeminde `receiveShadow`, modellerde her ikisi de
- [ ] GLB dosyaları `public/models/` altında, `useGLTF.preload` ile önyüklendi
- [ ] İçerik katmanında `pointer-events` doğru ayarlandı
