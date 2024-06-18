# 실행 명령어
- npm install : 설치 -> node_modules 폴더생성
- npm start : 개발모드 -> http://localhost:8080
- npm run build : 배포 테스트 -> build 폴더생성
- serve build : npm serve를 사용하여 실제 배포 환경에서 테스트 ->http://localhost:3000

# Dnd 기능구현
- ctrl, cmd 키보드 누른후 아이템 멀티 선택가능
- shift 키보드 누른후 아이템 멀티 선택가능
- 플러스 아이콘 클릭시 아이템 추가
- 휴지통 아이콘 클릭시 아이템 삭제
- 리로드 아이콘 클릭시 해당 리스트 새로고침

# 디렉토리 분리
- components : 리스트, 아이템 컴포넌트 모아놓은 디렉토리
- icons : 아이콘 모아놓은 디렉토리

# style
- css는 styled-components를 사용
