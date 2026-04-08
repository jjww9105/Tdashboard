# Soft Cloud Dashboard

초등학교 교실 태블릿에 항시 켜두는 학급 대시보드입니다.

## 기능

- 오늘의 급식 메뉴 + 칼로리 표시
- 날짜별 급식 스와이프/화살표 이동
- 학교 검색 및 자동 기억
- 일과시간(8~17시) 화면 자동 켜짐
- PWA 지원 (홈 화면에 추가하면 앱처럼 사용)

## 원클릭 배포

아래 버튼을 눌러 바로 배포할 수 있습니다. 환경변수 3개만 입력하면 됩니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Fsoft-cloud-dashboard&env=NEIS_API_KEY,VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY&envDescription=NEIS%20API%20%ED%82%A4%EC%99%80%20Supabase%20%EC%84%A4%EC%A0%95%EC%9D%B4%20%ED%95%84%EC%9A%94%ED%95%A9%EB%8B%88%EB%8B%A4.&envLink=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Fsoft-cloud-dashboard%2Fblob%2Fmain%2FDEPLOY_GUIDE.md)

> 배포 전에 [배포 가이드(DEPLOY_GUIDE.md)](./DEPLOY_GUIDE.md)를 반드시 읽어주세요.

## 환경변수

| 변수명 | 설명 | 어디서 발급? |
|---|---|---|
| `NEIS_API_KEY` | NEIS 공공데이터 API 키 | [공공데이터포털](https://open.neis.go.kr) |
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL | [Supabase](https://supabase.com) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon 키 | Supabase 프로젝트 설정 |

## 로컬 개발

```bash
npm install
cp .env.example .env
# .env 파일에 환경변수 입력
npm run dev
```

## 기술 스택

- React + Vite + Tailwind CSS
- Vercel Serverless Functions
- Supabase (PostgreSQL)
- NEIS 공공데이터 API
