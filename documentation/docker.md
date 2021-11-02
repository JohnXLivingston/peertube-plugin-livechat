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
# build the docker image, if not done yet:
sudo docker build . -f docker/Dockerfile.buster
# push on the main tag name:
sudo docker push johnxlivingston/peertubelivechat:production-buster
# push on the current peertube tag name:
sudo docker tag johnxlivingston/peertubelivechat:production-buster johnxlivingston/peertubelivechat:v3.4.1-buster
sudo docker push johnxlivingston/peertubelivechat:v3.4.1-buster
```
