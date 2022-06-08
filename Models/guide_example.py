def main():
    from Cluster import Cluster  # 클러스터링 모듈 불러오기
    from BertClassification import BertClassification    # 학습 및 연동 모듈 불러오기

    # TODO: 아래에서 API에서 받아오는 함수 필요!
    board_idx = '1'             # 어느 경로로부터 얻었던 board pk 값
    cus = Cluster(board_idx)  # 필요 데이터 넣기
    cus.connect()            # firebase 연결
    sen, member_idx = cus.getboard()  # 게시물 값 가져오기

    b_class = BertClassification("./data/bert_classifi_model.pt")  # 학습된 모델 불러오기
    b_class.loader()            # 모델 준비
    sample = b_class.evaluate(sen)  # 모델 결과 뽑기

    cus.getmembers(sample)   # 클러스터링을 위한 모든 데이터 가져오기(클래스 내부적으로 저장됨)
    # TODO: 아래에서 API를 호출해서 보내주는 작업 필요!
    members = cus.cluster()   # 맴버 인덱스 배열
    print(members)


if __name__ == "__main__":
    main()
