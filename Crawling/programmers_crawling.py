from urllib.error import HTTPError
from bs4 import BeautifulSoup
from urllib.request import Request, urlopen, HTTPError
import pandas as pd
import re
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.common.by import By
import csv

# 크롤링 메인부분
base_url = 'https://programmers.co.kr/'
option = 'job_positions/'
code = 2430
headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
count_data = 0

for n in range(code, 15000, 1):
    driver = webdriver.Chrome("chromedriver")
    URL = base_url + option + str(n)
    try:
        driver.get(url=URL)
        driver.implicitly_wait(3)
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        data1 = soup.find("div", {"class", "container container-position-show"})

        # 회사명, 공고제목
        if data1 is not None:
            company = data1.select_one("header > div > h2").text
            title = data1.select_one("header > div > h4").text

        # 나머지 데이터
        data2 = soup.find("div", {"class", "content-body col-item col-xs-12 col-sm-12 col-md-12 col-lg-8"})

        if data2 is not None:
            summarys = data2.select(".section-summary > table > tbody > tr")
            summary = []
            for sm in summarys:
                sm1 = sm.select_one("td:nth-of-type(2)").text
                sm2 = sm.select_one("td:nth-of-type(3)").text
                summary.append([sm1,sm2])

            stacks = data2.select(".section-stacks > table > tbody > tr > td > code")
            stack = []

            for sc in stacks:
                stack.append(sc.text)

            position = data2.select_one(".section-position")
            if position is not None:
                position = data2.select_one(".section-position").get_text()
            else:
                position = []           

            requirements = data2.select_one(".section-requirements")
            if requirements is not None:
                requirements = data2.select_one(".section-requirements").get_text()
            else:
                requirements = []   

            preference = data2.select_one(".section-preference")
            if preference is not None:
                preference = data2.select_one(".section-preference").get_text()
            else:
                preference = []    

            culture = data2.select_one(".section-culture")
            if culture is not None:
                culture = data2.select_one(".section-culture").get_text()
            else:
                culture = []           

            # 요약(section-summary)
            # 스택(section-stack)
            # 포지션(section-position)
            # 자격조건(section-requirements)
            # 우대사항(section-preference)
            # 개발팀&환경(section-culture)

            programmers_data = {
            'section-company' : company,
            'section-title' : title,
            'section-summary' : summary,
            'section-stack' : stack,
            'section-position' : position,
            'section-requirements' : requirements,
            'section-preference' : preference,
            'section-culture' : culture
            }  

            with open('./programmers.csv', 'a', encoding='utf-8', newline='') as csvfile:
                fieldnames = ['section-company', 'section-title', 'section-summary', 'section-stack', 'section-position', 'section-requirements','section-preference', 'section-culture']
                csvwriter = csv.DictWriter(csvfile, fieldnames=fieldnames)
                csvwriter.writerow(programmers_data)
            count_data += 1   
            print(n,'번째 : ', title)

    except HTTPError as e:
        print(e)
    driver.close()

print('crawling programmers done!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
print('총데이터:',count_data)


# 원래는 section-description 부분이 있었는데 해당부분은 안적은 회사들도 있고 이후 학습할때 키워드가 중요한 부분이 아니라 다량의 데이터를 더 얻기위하여 빼었음.

# 1차끊김 1706, 2차끊김 1716, 3차끊김 2430
