<p align="center">
    <img src="https://bun.sh/logo.svg" width="80" />
  &nbsp;
    &nbsp;
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Typescript.svg/250px-Typescript.svg.png" width="80" />
</p>

# Thử Thách Tình Yêu - My Love Confession App ❤️

Bạn đã bao giờ muốn tỏ tình hoặc trêu ghẹo người thương của mình bằng một trang web "cây nhà lá vườn" chưa? Nếu có thì đây chính là "vũ khí tối thượng" dành cho bạn!

Project này là một trang web nhỏ xinh, ban đầu sẽ đặt ra một câu hỏi tình yêu vô cùng "hóc búa". Nhưng đừng lo, dù câu trả lời có là gì, đích đến cuối cùng vẫn là một không gian 3D lãng mạn chứa đầy kỷ niệm của hai bạn.

**👉 Xem Demo Live tại đây:** **(https://my-love-confession-app.vercel.app/)**

---

## ✨ Tính năng nổi bật

* **Nút "Có" biết chạy trốn:** Một thử thách nho nhỏ để thử lòng kiên nhẫn của đối phương. Phải thật nhanh tay (hoặc kiên trì) mới bắt được nó đấy!
* **Giao diện 2 trong 1:** Bắt đầu với một câu hỏi troll, kết thúc bằng một gallery ảnh 3D siêu lãng mạn.
* **Hiệu ứng ngập tràn:** Từ trái tim bay lơ lửng, hiệu ứng lấp lánh cho đến background WebGL thú vị, tất cả tạo nên một không gian "ảo diệu".
* **Nhạc nền du dương:** Một bản nhạc nhẹ nhàng sẽ tự động phát để tăng thêm phần cảm xúc.
* **Tùy chỉnh dễ dàng:** Bạn có thể thay đổi mọi thứ từ tên, hình ảnh, âm nhạc chỉ trong vài nốt nhạc.

---

## 🛠️ Công nghệ sử dụng

* **Frontend:** HTML5, CSS3, TypeScript
* **Build Tool:** Vite
* **Runtime/Package Manager:** Bun

---

## 🚀 Cài đặt & Chạy Project

Chỉ cần vài bước đơn giản để "hồi sinh" project này trên máy của bạn:

1.  **Clone repository về máy:**
    ```bash
    git clone [https://github.com/HuynhSang2005/my-love-confession-app.git](https://github.com/HuynhSang2005/my-love-confession-app.git)
    ```

2.  **Di chuyển vào thư mục project:**
    ```bash
    cd my-love-confession-app
    ```

3.  **Cài đặt các "phụ tùng" cần thiết:**
    ```bash
    bun install
    ```

4.  **Chạy thôi!**
    ```bash
    bun run dev
    ```

    Mở trình duyệt và truy cập vào địa chỉ `http://localhost:5173` để xem thành quả.

---

## 🎨 Tùy chỉnh cho riêng bạn

Đây là phần quan trọng nhất để biến trang web này thành của riêng bạn! Mọi thứ đều nằm trong file `index.html`.

* **Thay đổi câu hỏi và tên:**
    * Tìm đến thẻ `<h2>` có class `question` và thay đổi nội dung câu hỏi.
      
        ```html
        <h2 class="question">Thí Nga có yêu Huỳnh Sang không?</h2>
        ```

* **Thay đổi ảnh kỷ niệm:**
    * Đặt 8 tấm ảnh đẹp nhất của bạn vào thư mục `public/assets/images/`.
    * Tìm đến thẻ `<img>` trong `div#spin-container` và thay đổi đường dẫn `src`.
      
        ```html
        <div id="spin-container">
          <img src="assets/images/1.jpg" alt="Kỷ niệm 1" />
          <img src="assets/images/2.jpg" alt="Kỷ niệm 2" />
          </div>
        ```
    * Thay đổi tiêu đề gallery ở thẻ `p.gallery-title`.
      
        ```html
        <p class="gallery-title">Kỷ niệm của chúng ta ❤️</p>
        ```

* **Thay đổi nhạc nền:**
    * Đặt file nhạc của bạn vào thư mục gốc `public/`.
    * Tìm đến thẻ `<audio>` và thay đổi `src`.
      
        ```html
        <audio src="ten-file-nhac-cua-ban.mp3" autoplay loop></audio>
        ```

* **Cập nhật thông tin Footer:**
    * Tìm đến thẻ `<footer>` và thay đổi link GitHub, Facebook, Instagram của bạn.

---

## 💖 Lời kết

Chúc bạn và "nửa kia" có những khoảnh khắc vui vẻ với món quà nhỏ này! Nếu bạn thấy project này thú vị, đừng ngần ngại cho mình một ngôi sao ⭐ nhé.

*Code with love, for love.*
