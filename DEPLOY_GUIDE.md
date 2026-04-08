# Soft Cloud Dashboard 배포 가이드

이 가이드를 따라하면 누구나 자신만의 학급 대시보드를 무료로 배포할 수 있습니다.

준비물: 이메일 계정 1개 (Google 또는 GitHub)

---

## 1단계: NEIS API 키 발급

NEIS(나이스)는 교육부 공공데이터 시스템입니다. 급식 정보를 가져오려면 API 키가 필요합니다.

1. [NEIS 오픈데이터 포털](https://open.neis.go.kr) 접속
2. 우측 상단 **회원가입** 클릭
3. 회원가입 완료 후 **로그인**
4. 상단 메뉴에서 **인증키 신청** 클릭
5. 신청 양식 작성:
   - 활용 용도: `교육/학습`
   - 서비스 명: `학급 대시보드` (아무 이름이나 가능)
6. **신청** 버튼 클릭
7. 발급된 **인증키(KEY)** 를 복사해서 메모장에 저장

> 인증키는 영문+숫자 조합의 긴 문자열입니다. 이것을 나중에 환경변수에 넣습니다.

---

## 2단계: Supabase 프로젝트 생성

Supabase는 무료 데이터베이스 서비스입니다. 학교 설정을 저장하는 데 사용합니다.

### 2-1. 가입 및 프로젝트 생성

1. [Supabase](https://supabase.com) 접속
2. **Start your project** 클릭 → GitHub 계정으로 로그인
3. **New Project** 클릭
4. 프로젝트 정보 입력:
   - Project name: `soft-cloud-dashboard` (아무 이름이나 가능)
   - Database Password: 비밀번호 설정 (기억해두세요)
   - Region: `Northeast Asia (Tokyo)` 선택 (한국에서 가장 빠름)
5. **Create new project** 클릭 → 2~3분 대기

### 2-2. 프로젝트 URL과 키 복사

1. 프로젝트 생성 완료 후, 좌측 메뉴에서 **Project Settings** (톱니바퀴 아이콘) 클릭
2. **API** 탭 클릭
3. 다음 두 값을 메모장에 복사:
   - **Project URL** → 이것이 `VITE_SUPABASE_URL`
   - **anon public** 키 → 이것이 `VITE_SUPABASE_ANON_KEY`

### 2-3. 테이블 생성

1. 좌측 메뉴에서 **SQL Editor** 클릭
2. 아래 SQL을 복사하여 붙여넣기:

```sql
CREATE TABLE school_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  school_name TEXT NOT NULL,
  education_office_code TEXT NOT NULL,
  school_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON school_settings
  FOR ALL USING (true) WITH CHECK (true);
```

3. **Run** 버튼 클릭
4. "Success" 메시지 확인

---

## 3단계: Vercel 배포

### 3-1. GitHub 계정 준비

Vercel은 GitHub 계정으로 로그인합니다.
- GitHub 계정이 없다면: [github.com](https://github.com) 에서 무료 가입

### 3-2. 원클릭 배포

1. 프로젝트 README의 **"Deploy with Vercel"** 버튼 클릭
2. GitHub 계정으로 Vercel 로그인
3. **Create Git Repository** 화면:
   - GitHub 선택
   - Repository Name: `soft-cloud-dashboard` (자동 입력됨)
4. **Environment Variables** 입력:

| 변수명 | 입력할 값 |
|---|---|
| `NEIS_API_KEY` | 1단계에서 발급받은 NEIS 인증키 |
| `VITE_SUPABASE_URL` | 2단계에서 복사한 Project URL |
| `VITE_SUPABASE_ANON_KEY` | 2단계에서 복사한 anon public 키 |

5. **Deploy** 버튼 클릭
6. 1~2분 대기 → 배포 완료!
7. 화면에 표시되는 URL (예: `soft-cloud-dashboard-xxxx.vercel.app`)이 나의 대시보드 주소

---

## 4단계: 태블릿 설정

### 4-1. 대시보드 접속

1. 태블릿 브라우저(Chrome 권장) 열기
2. 3단계에서 받은 URL 입력하여 접속
3. 학교 이름 검색 → 우리 학교 선택

### 4-2. 홈 화면에 추가 (앱처럼 사용하기)

**Android 태블릿 (Chrome):**
1. 브라우저 우측 상단 **점 세 개(...)** 메뉴 클릭
2. **"홈 화면에 추가"** 선택
3. 확인 클릭
4. 홈 화면에 생긴 아이콘을 터치하면 앱처럼 전체화면으로 열림

**iPad (Safari):**
1. 하단 **공유 버튼** (네모에 위쪽 화살표) 클릭
2. **"홈 화면에 추가"** 선택
3. 확인 클릭

### 4-3. 화면 자동 켜짐

대시보드가 열려 있는 동안, 일과시간(오전 8시 ~ 오후 5시)에는 화면이 자동으로 꺼지지 않습니다. 오후 5시 이후에는 태블릿 설정대로 자동 꺼짐이 동작합니다.

---

## 문제 해결

### 급식이 안 나와요
- NEIS API 키가 올바르게 입력되었는지 확인
- Vercel 프로젝트 Settings → Environment Variables에서 `NEIS_API_KEY` 값 확인
- 주말/공휴일/방학에는 급식 정보가 없을 수 있습니다

### 학교가 검색되지 않아요
- 학교 이름을 2글자 이상 입력해야 검색됩니다
- 초등학교만 검색됩니다

### 배포 후 화면이 안 나와요
- Vercel 대시보드에서 Deployment 로그 확인
- 환경변수 3개가 모두 입력되었는지 확인

---

## 환경변수 정리

| 변수명 | 설명 | 어디서? |
|---|---|---|
| `NEIS_API_KEY` | NEIS 공공데이터 인증키 | [open.neis.go.kr](https://open.neis.go.kr) → 인증키 신청 |
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon 공개 키 | Supabase → Project Settings → API |
