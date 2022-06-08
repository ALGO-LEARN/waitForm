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
        self.column = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9']

    def connect(self):  # DB 연결 함수
        cred = credentials.Certificate("./data/serviceAccountKey.json")
        firebase_admin.initialize_app(cred, {
            'projectId': "waitform-test"
        })
        self.dblink = firestore.client()

    def getboard(self):
        board = self.dblink.collection(u'BOARD').document(u"%s" % self.board_idx)
        board_data = board.get()
        if board_data.exists:
            tmp = board_data.to_dict()
            return tmp['content'], tmp['member']['id']
        else:
            return None

    def getmembers(self, class_arr):    # 모든 사용자 데이터 반환 함수
        usr_df = pd.DataFrame([class_arr], columns=self.column)
        if self.dblink:
            docs = self.dblink.collection(u'MEMBER').stream()
            self.df = pd.DataFrame(columns=self.column)

            for i, doc in enumerate(docs):
                tmp = pd.DataFrame(doc.to_dict(), index=[i])
                self.df = pd.concat([self.df, tmp])

            self.df = pd.concat([self.df, usr_df])
            # return self.df

        else:
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

        for i, j in enumerate(fake_arr):
            data = self.dblink.collection(u'MEMBER')
            data.document(u"%d" % (i + 1)).set({u'%s' % a: b for a, b in zip(self.column, j)})

    # FIXME: 반복문 때문에 일부 사용자 없다면 오류
    def clear(self, n=1000):    # 모든 사용자 제거 함수
        for i in range(n):
            self.dblink.collection(u'MEMBER').document(u"%d" % (i + 1)).delete()

    def cluster(self, k=10):    # 클러스터링
        from sklearn.cluster import KMeans

        model = KMeans(n_clusters=k, random_state=10)
        arr = self.df.to_numpy()
        model.fit(arr)
        self.df['cluster'] = model.fit_predict(arr)

        num = self.df.iloc[-1]['cluster']
        return list(self.df[self.df['cluster'] == num].head().index), self.board_idx

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
