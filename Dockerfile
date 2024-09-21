FROM node:20.17.0

# 设置npm镜像源为阿里云
RUN npm config set registry https://registry.npmmirror.com

# 安装yarn并设置镜像源为阿里云
RUN npm install -g yarn --force && yarn config set registry https://registry.npmmirror.com

COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean --force

COPY . . 

# Expose port 3000 to the outside world
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]