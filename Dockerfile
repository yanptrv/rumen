FROM python:3.8.9

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY ./RUMEN /RUMEN

WORKDIR /RUMEN
EXPOSE 8080

RUN apt update && apt upgrade -y && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y build-essential nodejs && \
    python -m pip install --upgrade pip && \
    pip install -U pipenv

RUN pipenv install --system --deploy
RUN python manage.py migrate

WORKDIR ./frontend

RUN npm i
RUN npm run build

WORKDIR /RUMEN

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]