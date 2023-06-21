# 🌼 모두를 위한 설문조사 플랫폼, A-FORM

![a-form](/resource/a-form.png)
설문 조사 생성 및 분석 프로세스를 단순화하여 설문 조사 제작자와 응답자 간의 참여와 피드백을 높일 수 있는 간편한 설문 조사 플랫폼입니다.

**개발 기간** 2023.03 ~ 2023.05 <br/>
**사이트 바로가기** https://server.acceler.kr/ (🔧업데이트 중)<br/>
**Team repo** https://github.com/orgs/KEA-ACCELER/repositories <br/>

# 😺 Stacks

<img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"> <img src="https://img.shields.io/badge/mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white"> <img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"> <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/aws ec2-FF9900?style=for-the-badge&logo=amazon-ec2&logoColor=white"> <img src="https://img.shields.io/badge/aws s3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white"> <img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white">

# 📚 Project Structure

```
src
├── common          # 공통 컴포넌트
│   ├── constant
│   ├── decorator
│   ├── dto
│   ├── guard
│   └── pipe
├── cache           # 캐시 모듈
├── batch           # batch 모듈
├── answer          # 응답 모듈
│   ├── controller
│   ├── dto
│   ├── helper
│   ├── pipe
│   ├── repository
│   └── service
├── file            # 파일 모듈
│   ├── controller
│   ├── dto
│   ├── helper
│   ├── repository
│   └── service
├── my-page         # 마이페이지 모듈
│   ├── controller
│   └── service
├── schema          # 스키마
└── survey          # 설문지 모듈
    ├── controller
    ├── dto
    ├── helper
    ├── pipe
    ├── repository
    └── service
```

## Components

- common
  - 공통적으로 사용될 파일로 구성
  - `constant`, `decorator`, `dto`, `guard`, `pipe` 등
- cache
  - 레디스를 사용한 기본적인 캐싱 처리
- batch
  - 매시간마다 스케줄러를 통해 시간별 인기글 캐싱 처리
- schema
  - 스키마 관련 파일로 구성
- answer
  - 설문 응답 관련 파일로 구성
- file
  - 파일 처리 관련 파일로 구성
- my-page
  - 마이페이지 관련 파일로 구성
- survey
  - 설문 관련 파일로 구성

# 🙂 Pattern & Workflow

## Repository Pattern

비즈니스 로직이 있는 서비스 계층과 데이터베이스에 접근하는 데이터 소스 계층 사이에 레포지토리 계층을 생성해 두 계층을 중계

## Caching

**캐싱 전략**
Look Aside + Write Around

- 데이터를 찾을 때 우선적으로 캐시에 있는지 확인하고, 캐시에 데이터가 없는 경우에만 데이터베이스(DB)에서 조회 -> 이후 조회한 데이터는 캐시에 저장

**시간별 인기 설문 캐싱**
정각마다 cron job을 통해 시간별 인기 설문(이전 한 시간 동안 설문 응답이 가장 많은 것)을 캐싱

```typescript
 @Cron(CronExpression.EVERY_HOUR, {
    name: 'popular-survey',
    timeZone: 'Asia/Seoul',
  })
  async cachingPopularSurvey() {
    const currentTime = moment().tz('Asia/Seoul').toDate();
    const popularSurvey = await this.surveyService.findPopular({
      date: currentTime,
      type: PopularSurveyResponseType.ID,
    });

    await this.cacheService.set(
      this.keyHelper.getPopularSurveyKey(currentTime),
      JSON.stringify(popularSurvey),
    );
  }
```

# ✨ Installation

## .env

```bash
PORT=

# MONGOOSE
DATABASE_URL=
DATABASE_USER=
DATABASE_PASSWORD=

# REDIS
USER_HOSTNAME=
REDIS_HOST=
REDIS_PORT=

# AWS S3
AWS_ENDPOINT=
REGION=
S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## Running the app

- 로컬에서 실행

```
# 패키지 설치
$ npm install

# development, 데모 시 사용
$ npm start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

- 도커 컨테이너 실행

```
docker compose up -d
```

# 🍀 Swagger

```
http://localhost:${PORT}/surveys/api
```

![swagger](/resource/swagger.png)

# 🌱 Test

```
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
