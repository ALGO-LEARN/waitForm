import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import pandas as pd
import numpy as np


class Cluster:
    def __init__(self, board_idx):
        self.df = None
        self.dblink = None
        self.board_idx = board_idx
        self.column = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'id']

    def connect(self):  # DB 연결 함수
        if not firebase_admin._apps:
            cred = credentials.Certificate("./data/serviceAccountKey.json")
            firebase_admin.initialize_app(cred, {
                'projectId': "waitform-test"
            })
        self.dblink = firestore.client()

    def getboard(self):
        import re
        board = self.dblink.collection(u'BOARD').document(u"%s" % self.board_idx)
        board_data = board.get()
        if board_data.exists:
            tmp = board_data.to_dict()
            return re.sub('(<([^>]+)>)', '', tmp['content']), tmp['member']['id']              # 게시물 데이터, 게시물 쓴 사람
        else:
            return None, None

    def getmembers(self, class_arr):    # 모든 사용자 데이터 반환 함수
        usr_df = pd.DataFrame([class_arr], columns=self.column)     # 글에 대한 특징값 배열을 데이터프레임으로 변환
        if self.dblink:     # db에 데이터가 있다면
            docs = self.dblink.collection(u'MEMBER').stream()       # 사용자 정보 긁어오기
            self.df = pd.DataFrame(columns=self.column)             # 사용자 정보 데이터프레임 생성

            for i, doc in enumerate(docs):                          # 사용자 수 만큼 반복
                tmp = pd.DataFrame(doc.to_dict(), index=[i])        # 임시 데이터프레임에 저장
                self.df = pd.concat([self.df, tmp])                 # 합치기

            self.df = pd.concat([self.df, usr_df])                  # 특징값과 함께 데이터프레임 완성

        else:               # db에 데이터가 없거나 문제가 생겼다면
            return "no connection!"

    def creator(self, n=1000):  # 가상 사용자 생성 함수
        import torch
        from torch import nn

        c_arr = []
        for _ in range(n):
            arr2 = []
            for i in range(10):
                arr3 = np.random.randint(2 ** i, 2 ** (i + 1))
                arr2.append(arr3)
            arr2 = np.random.permutation(arr2)
            c_arr.append(arr2 / np.linalg.norm(arr2))

        m = nn.Softmax(dim=1)
        fake_arr = m(torch.Tensor(c_arr)).numpy()
        fake_arr = np.append(fake_arr, [[i] for i in range(1, n + 1)], axis=1)

        for i, j in enumerate(fake_arr):
            data = self.dblink.collection(u'MEMBER')
            data.document(u"%d" % (i + 1)).set({u'%s' % a: b for a, b in zip(self.column, j)})

    # FIXME: 반복문 때문에 일부 사용자 없다면 오류
    def clear(self, n=1000):    # 모든 사용자 제거 함수
        for i in range(n):
            self.dblink.collection(u'MEMBER').document(u"%d" % (i + 1)).delete()

    def cluster(self, k=10, max_return=5):    # 클러스터링
        from sklearn.cluster import KMeans

        model = KMeans(n_clusters=k, random_state=10)
        arr = self.df.drop(['id'], axis=1).to_numpy()
        model.fit(arr)
        self.df['cluster'] = model.fit_predict(arr)

        num = self.df.iloc[-1]['cluster']               # 클러스터링 된 인덱스 번호
        cdata = np.array(self.df.iloc[-1][:10])         # 입력 들어온 값의 데이터
        same_data = self.df[self.df['cluster'] == num]  # 같은 클러스터 데이터프레임
        result = np.array([])                           # 추천 유저 리스트
        for i in same_data.index:                       # 같은 클러스터 반복
            s = np.array(same_data.loc[i])[:10]         # 각 row 넘파이 변환
            dist = np.linalg.norm(cdata-s)              # 거리 공식
            result = np.append(result, [dist])          # 거리 추가
        max_return += 1     # 인덱스 슬라이딩 때문에 추가
        members = np.argpartition(result, max_return)[1:max_return]
        return [int(i) for i in members]

    def update(self, member_idx, class_arr):   # 사용자 데이터 갱신
        member = self.dblink.collection(u'MEMBER').document(u"%s" % member_idx)
        member_data = member.get()
        if member_data.exists:
            tmp = member_data.to_dict()
            legacy_data = np.array([tmp[c] for c in self.column])
            update_data = (legacy_data + class_arr) / 2.0
            member.update({u'%s' % i: j for i, j in zip(self.column, update_data)})

        else:
            print("Failed: member data update")
