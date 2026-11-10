<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<br />
<div align="center">
  <h3 align="center">Boykotify</h3>

  <p align="center">
    Spotify çalma listelerinizi tarayan ve proje tarafından işaretlenen sanatçıların şarkılarını listenizden ayıklamanıza yardımcı olan bir proje.
    <br />
    <a href="https://boykotify.vercel.app"><strong>Canlı Demo</strong></a>
    <br />
    <br />
    <a href="https://github.com/aybrkaknc/boykotify/issues/new?labels=bug">Hata Bildir</a>
    &middot;
    <a href="https://github.com/aybrkaknc/boykotify/issues/new?labels=enhancement">Özellik İste</a>
  </p>

  <p align="center">
    <a href="README.md">English</a> | <a href="README.tr.md">Türkçe</a>
  </p>
</div>

<details>
  <summary>İçindekiler</summary>
  <ol>
    <li>
      <a href="#proje-hakkında">Proje Hakkında</a>
      <ul>
        <li><a href="#kullanılan-teknolojiler">Kullanılan Teknolojiler</a></li>
      </ul>
    </li>
    <li>
      <a href="#başlarken">Başlarken</a>
      <ul>
        <li><a href="#gereksinimler">Gereksinimler</a></li>
        <li><a href="#kurulum">Kurulum</a></li>
      </ul>
    </li>
    <li><a href="#kullanım">Kullanım</a></li>
    <li><a href="#katkıda-bulunma">Katkıda Bulunma</a></li>
    <li><a href="#iletişim">İletişim</a></li>
  </ol>
</details>

## Proje Hakkında

Boykotify, Spotify kütüphanenizdeki çalma listelerini tarar ve listedeki sanatçılara ait şarkıları işaretler. Sonuçları kategoriye göre filtreleyebilir, işaretli şarkıları tek tıkla ya da toplu olarak listenizden çıkarabilirsiniz.

- **Hızlı Tarama**: Spotify çalma listelerindeki işaretli sanatçıları anlık tespit eder.
- **İnteraktif Filtreleme**: Skor tablosu üzerinden kategorilere göre şarkıları anında süzün.
- **Tek Tıkla Temizlik**: İşaretli şarkıları tek tek veya toplu olarak listenizden çıkarın.
- **Veri Kalıcılığı**: Sayfa yenilense bile taranan sonuçlarınız korunur.
- **Minimalist Tasarım**: Göz yormayan, aksiyon odaklı ve modern bir kullanıcı arayüzü.
- **Animasyonlar**: Şarkı silme eylemi için geçiş efektleri.

Daha fazla detay için [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) dosyasını inceleyebilirsiniz.

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

### Kullanılan Teknolojiler

* [![React][React-shield]][React-url]
* [![Vite][Vite-shield]][Vite-url]
* [![Supabase][Supabase-shield]][Supabase-url]

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

## Başlarken

### Gereksinimler

* Node.js ve npm
* Web API istemci kimliği olan bir Spotify Developer uygulaması

### Kurulum

1. Bağımlılıkları yükleyin
   ```sh
   npm install
   ```
2. `.env.example` dosyasından bir `.env` dosyası oluşturun ve API anahtarlarınızı ekleyin
3. Geliştirme sunucusunu başlatın
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

## Kullanım

Uygulamayı açın, Spotify hesabınızı bağlayın ve çalma listeleriniz üzerinde bir tarama başlatın. İşaretli şarkıları skor tablosunda inceleyin, kategoriye göre filtreleyin ve çalma listelerinizden çıkarın.

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

## Katkıda Bulunma

Katkılarınız memnuniyetle karşılanır. Depoyu fork edin, bir özellik dalı oluşturun, değişikliklerinizi commit edip bir pull request açın. "enhancement" etiketiyle bir issue da açabilirsiniz.

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

## İletişim

Ayberk - [@aybrkaknc](https://github.com/aybrkaknc)

Proje Bağlantısı: [https://github.com/aybrkaknc/boykotify](https://github.com/aybrkaknc/boykotify)

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/aybrkaknc/boykotify.svg?style=for-the-badge
[contributors-url]: https://github.com/aybrkaknc/boykotify/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/aybrkaknc/boykotify.svg?style=for-the-badge
[forks-url]: https://github.com/aybrkaknc/boykotify/network/members
[stars-shield]: https://img.shields.io/github/stars/aybrkaknc/boykotify.svg?style=for-the-badge
[stars-url]: https://github.com/aybrkaknc/boykotify/stargazers
[issues-shield]: https://img.shields.io/github/issues/aybrkaknc/boykotify.svg?style=for-the-badge
[issues-url]: https://github.com/aybrkaknc/boykotify/issues
[React-shield]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[Vite-shield]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Supabase-shield]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
