# 1. 실행 명령어
- npm install : 설치 -> node_modules 폴더생성
- npm start : 개발모드 -> http://localhost:8080
- npm run build : 배포 테스트 -> build 폴더생성
- serve build : npm serve를 사용하여 실제 배포 환경에서 테스트 ->http://localhost:3000

# 2. 웹팩 설정 및 기능구현
- Webpack 적용 : Webpack을 직접 설정하여 React 애플리케이션을 구성
- 칼럼 확장 : 기존의 한 칼럼에서 네 개의 칼럼으로 확장
- 멀티 드래그 기능 구현 : ctrl, cmd, shift 키보드 누른후 드래그시 멀티 드래그 가능
- 드래그 제약 조건 적용
  1. 1번리스트에서 3번리스트로 이동불가
  2. 같은리스트내에서 짝수아이템은 짝수아이템앞으로 이동불가 (이부분은 아래에서 위로 올라올때만 해당함, ex : 10번이 8번앞으론 못가지만 8번은 10번앞으로 가능)
  3. 이동 할수없는 지점으로 이동시 배경색이 빨간색으로 변경하여 이동 불가를 보여줌


# 3. Dnd 기능구현
- ctrl, cmd 키보드 누른후 아이템 멀티 선택가능
- shift 키보드 누른후 아이템 멀티 선택가능
- 플러스 아이콘 클릭시 아이템 추가
- 휴지통 아이콘 클릭시 아이템 삭제
- 리로드 아이콘 클릭시 해당 리스트 새로고침

# 4. 디렉토리 분리
- components : 리스트, 아이템 컴포넌트 모아놓은 디렉토리
- icons : 아이콘 모아놓은 디렉토리

# 5. style
- css는 styled-components를 사용

# 6. WebPack 및 styled components 설치 및 설정
- index.html, index.js 파일을 source 폴더아래두기

 
# 7. package.json 스크립트 수정
- start, dev 수정
  
# 8. webpack.config.js 생성 및 설정

# 9. npm start, npm run build 실행 및 확인완료
