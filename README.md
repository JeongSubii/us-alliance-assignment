# us-alliance-assignment

### Tech stack

NestJs, Typescript, node-json-db, Swagger, etc...

<br/>

### ERD
```angular2html
테이블명 : job
파일 위치: /src/entities/job.entity 
```

### data
```angular2html
/data/job.json
```

### scheduler logs
```angular2html
/logs/logs.txt
```

### API Docs (Swagger)
```angular2html
link: http://localhost:4000/swagger
id: test
pw: test1234
```

### SETUP

#### USING NPM

```
1. npm i OR npm i --legacy-peer-deps
2. npm run start:dev
```

### Comment
```
<API 디자인 및 서빙 전략>
    - module-controller-service-repository 패턴
        : 데이터 조회로직을 repository로 분리
    - entity class로 타입 안정성 확보
        : 컴파일 타임 타입 안정성 확보
    - RESTful 설계
        : jobs 리소스에 대해 POST, GET, 검색 등 표준 HTTP 메서드 활용
    - 응답 코드
        : 201(생성), 200(조회), 400(잘못된 요청), 404(없음), 409(중복), 500(서버 에러) 등 상황별로 구분
    - Swagger 기반 문서화
        : `@ApiOperation`, `@ApiResponse` 등으로 API 명세 자동화
    - DTO 활용
        : 요청/응답 구조를 명확히 정의해 타입 안정성
    - config(@nestjs/config) 파일로 환경변수 관리
        : 기존 key-value(.env) 형식이 아닌 객체 형식(config)으로 관리함으로써, 타입안정성 및 그룹화, 의존성 주입 용이 
	    
<데이터 처리 전략>
    - 파일 기반 데이터베이스(node-json-db)
        : 경량 서비스에 적합하며, 별도 DB 구축 없이 빠른 개발 가능
    - 동시성 제어(Mutex)
        :파일 기반의 read-modify-write 패턴에서 데이터 유실 방지
    - 배치/스케줄러
        : NestJS Schedule로 주기적 상태 변경 및 로그 기록
    - 배치처리 최적화
        : 대량 업데이트 시 변경사항을 메모리에 모아 한번에 저장 (파일 I/O 최적화, Mutex락 획득/해제 횟수 감소)
	    
<성능 관리 전략>
    - 페이징 처리
        : 대량 데이터 조회 시 slice로 페이징(네트워크 전송량만 줄임)
        ** 필요시 DB 전환 고려 (데이터가 적을 때는 실용적이지만, 데이터가 많아지면 반드시 DBMS로 전환하거나, Stream(stream-json, JSONStream 라이브러리) 등 다른 구조로 리팩터링)
    - 비동기/await 활용
        : 모든 I/O 작업은 await로 논블로킹 처리
    - 에러 로깅
        : 실패 시 로그 파일 기록 및 콘솔 경고로 장애 조기 감지
    - common 폴더
        : 공통으로 쓰이는 dto, enum, interface를 공통(common) 폴더에서 관리
    - node-json-db 구조 변경
        : 기존 배열 → 객체 구조로 변경해 O(n) -> O(1) 조회 성능 향상
	    
<기타 구현 디테일>
    - 폴더 자동 생성
        : 데이터/로그 폴더가 없으면 자동 생성하여 배포 환경에서도 문제 없이 동작
    - 타임존 명시
        : 스케줄러의 시간대(`Asia/Seoul`)를 명확히 지정
    - 코드 일관성
        : 서비스, 레포지토리, DTO 등 계층별 역할을 명확히 분리
    - 테스트 용이성
        : 의존성 주입(DI) 기반 설계로 테스트 대체/확장 용이
```

### Author

```
2025.04.22 ~ 2025.04.25
Author: Subi Jeong
```


