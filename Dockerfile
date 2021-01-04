FROM nginx

COPY index.html /usr/share/nginx/html
COPY style.css /usr/share/nginx/html
COPY covid.js /usr/share/nginx/html
COPY opencv.js /usr/share/nginx/html
COPY web_model_14/* /usr/share/nginx/html/web_model_14/
COPY web_model_covid/* /usr/share/nginx/html/web_model_covid/

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

COPY ssl.csr /etc/nginx/ssl.csr
COPY ssl.key /etc/nginx/ssl.key

EXPOSE 443
