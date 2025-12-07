# --- Stage 1: Build React App ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ source code và build
COPY . .
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy file build từ stage 1 vào thư mục mặc định của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# (Tùy chọn) Nếu bạn có file cấu hình nginx riêng cho frontend thì copy vào
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
