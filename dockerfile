FROM node:22

# Dependencias del sistema necesarias para compilar better-sqlite3
RUN apt-get update && apt-get install -y python3 g++ make && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos todas las dependencias (dev incluidas)
RUN npm install

# Copiamos el resto del proyecto
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
