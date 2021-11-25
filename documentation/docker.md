# Docker

## Build the docker image

Install Docker.
Clone the git repository.
Then:

```shell
sudo docker build . -f docker/Dockerfile.buster
```

## Publish docker image

NB: the above commands are only available for John Livingston.
You have to replace by your own docker up repository
if you really need to build such an image.

First, you have to authenticate your Docker environment.
Create an access token on your hub.docker.com account, then use
`sudo docker login --username johnxlivingston` to add your credentials.

```shell
# pull the current peertube production image:
sudo docker pull chocobozzz/peertube:production-buster
# build the docker image, if not done yet:
sudo docker build . -f docker/Dockerfile.buster
# list images to find the image id:
sudo docker images
#REPOSITORY            TAG                 IMAGE ID       CREATED          SIZE
#<none>                <none>              0209eea56505   17 seconds ago   1.19GB
#chocobozzz/peertube   production-buster   4af03ae51fd2   4 days ago       1.17GB

# tag the image:
sudo docker tag 0209eea56505 johnxlivingston/peertubelivechat:production-buster
# push on the main tag name:
sudo docker push johnxlivingston/peertubelivechat:production-buster
# push on the current peertube tag name:
sudo docker tag johnxlivingston/peertubelivechat:production-buster johnxlivingston/peertubelivechat:v3.4.1-buster
sudo docker push johnxlivingston/peertubelivechat:v3.4.1-buster
```
