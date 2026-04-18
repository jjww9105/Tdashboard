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
2. **New Query** 클릭 → 아래 SQL 전체를 복사하여 붙여넣기:

```sql
-- 1) 학급 설정 (학교 + 학년/반 + 교시 설정)
CREATE TABLE IF NOT EXISTS class_setting (
  id TEXT PRIMARY KEY DEFAULT 'default',
  school_name TEXT NOT NULL,
  education_office_code TEXT NOT NULL,
  school_code TEXT NOT NULL,
  grade INTEGER,
  class_no INTEGER,
  source_preference TEXT DEFAULT 'neis',
  periods_per_day INTEGER DEFAULT 6,
  period_times JSONB,
  lesson_duration_min INTEGER DEFAULT 40,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2) 시간표 (NEIS 미등록 학교용 수동 입력 저장소)
CREATE TABLE IF NOT EXISTS timetable (
  school_code TEXT NOT NULL,
  grade INTEGER NOT NULL,
  class_no INTEGER NOT NULL,
  weekday INTEGER NOT NULL,
  period INTEGER NOT NULL,
  subject TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (school_code, grade, class_no, weekday, period)
);

-- 3) RLS 정책 (anon key로 읽기/쓰기 허용)
ALTER TABLE class_setting ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon all on class_setting" ON class_setting
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "anon all on timetable" ON timetable
  FOR ALL USING (true) WITH CHECK (true);
```

3. **Run** 버튼 클릭
4. "Success" 메시지 확인

> **중요:** 이 앱은 **학급 1개당 Supabase 프로젝트 1개**를 전제로 합니다. 여러 학급이 같은 프로젝트를 공유하면 서로의 데이터를 덮어쓸 수 있으니, 선생님마다 본인 Supabase 프로젝트를 따로 만들어 주세요.

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

## 5단계: 시간표 탭 사용법

시간표 탭은 우리 학급 주간 시간표를 한눈에 보여줍니다. 처음 진입하면 학급 설정 화면이 먼저 뜹니다.

### 5-1. 학급 설정 (최초 1회)

1. 하단 탭에서 **시간표** 선택
2. 자동으로 뜬 설정 화면에서 입력:
   - **학교**: "학교 선택"을 눌러 우리 학교 검색
   - **학년 / 반**: 우리 반 숫자 입력
   - **하루 교시 수**: 3~7 중 선택(기본 6)
   - **시간표 데이터**: 아래 두 가지 중 선택
3. 우상단 닫기(✕)를 눌러 시간표로 진입

### 5-2. 시간표 데이터 소스

| 옵션 | 언제 쓰나? | 특징 |
|---|---|---|
| **NEIS 자동** | NEIS에 시간표가 등록된 학교 | 매주 자동 갱신, 편집 불가 |
| **직접 입력** | NEIS에 시간표가 없거나, 반별로 시간표가 다른 경우 | 교사가 직접 입력, 다른 태블릿에도 동기화 |

- NEIS 자동 모드인데 이번 주 시간표가 비어 있으면 "NEIS에 시간표가 없어요" 안내가 뜹니다. **지금 입력**을 누르면 직접 입력 모드로 자동 전환됩니다.
- 주간 화면 좌/우로 스와이프하거나 화살표를 눌러 **이전 주 / 다음 주(±2주)** 볼 수 있습니다. 편집은 **이번 주**에서만 가능합니다.

### 5-3. 편집(직접 입력 모드)

1. 시간표 상단의 **[편집]** 버튼 탭
2. 비어 있는 칸(+) 또는 수정할 과목 칸 탭
3. 하단에서 올라온 과목 목록에서 선택. 목록에 없으면 **기타**를 눌러 직접 입력(최대 20자)
4. 저장은 자동. 편집을 끝내려면 **[완료]** 탭

편집은 저장 실패 시 원래 값으로 되돌아가며 "저장에 실패했어요" 토스트가 뜹니다. 네트워크를 확인하고 다시 시도하세요.

### 5-4. 설정 변경 및 보안 PIN

우측 상단 **⚙️ 아이콘**을 누르면 설정 화면으로 갈 수 있는데, 처음 누를 때 **4자리 PIN**을 설정하도록 안내합니다.

- PIN은 **태블릿 기기별로 독립**입니다(여러 태블릿이면 각각 설정).
- PIN을 잊었다면 설정 시 등록한 **힌트 보기**를 활용합니다.
- PIN은 다른 사람이 설정을 함부로 바꾸지 못하도록 하는 경미한 잠금 수단이며, 학급 데이터를 암호화하지는 않습니다.

### 5-5. 현재 교시 강조 (선택 기능)

각 교시 시작 시각을 알려주면, 지금 진행 중인 교시에 **분홍색 테두리**가 표시됩니다.

1. 설정 화면 하단의 **교시 시간** 섹션에서 "사용 안 함" → **"사용 중"** 토글
2. 각 교시의 **시작 시각**을 입력(예: 1교시 09:00)
3. **한 교시 길이**(기본 40분) 확인

사용 안 함으로 두면 현재 교시 강조가 표시되지 않습니다. 기본값은 비활성 상태입니다.

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

### 시간표가 비어 있어요
- NEIS 자동 모드에서 INFO-200 응답이 오면 "NEIS에 시간표가 없어요" 안내가 뜹니다. **지금 입력**을 눌러 직접 입력 모드로 전환하세요.
- 이전/다음 주 이동 시에도 비어 있으면 해당 주 데이터가 NEIS에 아직 없는 것입니다. 학기 초반 특히 자주 발생합니다.

### 다른 태블릿과 시간표가 달라요
- 학급 설정과 직접 입력한 시간표는 **Supabase로 동기화**되어 모든 태블릿에서 같이 보입니다.
- 단, **PIN은 기기별**로 저장됩니다. 새 태블릿에서는 설정 진입 시 새 PIN을 요구합니다.
- 동기화가 안 될 때는 환경변수 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`를 다시 확인하세요.

---

## 환경변수 정리

| 변수명 | 설명 | 어디서? |
|---|---|---|
| `NEIS_API_KEY` | NEIS 공공데이터 인증키 | [open.neis.go.kr](https://open.neis.go.kr) → 인증키 신청 |
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon 공개 키 | Supabase → Project Settings → API |
