# Base Image
FROM node:18-alpine

#Set working directory
WORKDIR /app

#Copy package files
COPY package*.json ./

#Install dependencies
RUN npm install

#Copy project files
COPY . .

# Create a image folder
RUN mkdir -p images

#Expose port 8080
EXPOSE 8080

#Start the application
CMD ["npm", "start"]