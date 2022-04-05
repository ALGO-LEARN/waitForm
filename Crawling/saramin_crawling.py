from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
import pandas as pd
import re
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.common.by import By
import csv

# 데이터를 받을 리스트
link_list = []

# 총 1~ 378까지 1페이지는 살짝 다름
for i in range(2, 378):
    # it전직군 크롤링
    url = 'https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=' + str(i) + '&cat_mcls=2&search_optional_item=n&search_done=y&panel_count=y&isAjaxRequest=0&page_count=50&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=1#searchTitle'
    headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    request = Request(url, headers=headers)
    response = urlopen(request)
    html = response.read()
    soup = BeautifulSoup(html, 'html.parser')

    # 한페이지의 공고개수 세기
    links = soup.select('.job_tit > a')
    for link in links:
        href = link.attrs['href']
        link_list.append(href)

print('step1 done!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
print('출력된 번호의 개수:', len(link_list))
print()

# 한 페이지당 데이터 저장
''' company_names = []
titles = []
service_introductions = []
contents = []
welfares = [] '''

# 숫자만 뽑아오기
for number, link in enumerate(link_list):
    link = link[48:]
    idx = link.find('&')
    if idx != -1:
        idx = link.find('&')
        link = link[:idx]

    # 페이지 크롤링\
    driver = webdriver.Chrome("chromedriver")
    URL = 'https://www.saramin.co.kr/zf_user/jobs/relay/view?isMypage=no&rec_idx=' + link + '&recommend_ids=eJxNjrERA0EIA6txDgIExC7k%2B%2B%2FC%2BILjyXYkFhwsFc2nlJ%2F8OhxBr6fQB9manBR60CAZNuWDEqXRFzFTVRfdPNyuKqoleFV0svuW55BRFqkU3TcUnmsebWDvclY7X3cjDZuOt9cMaedrt4h3WS1l0%2FnZKv74A0PEP%2F8%3D&view_type=list&gz=1#seq=0'
    headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    driver.get(url=URL)
    driver.implicitly_wait(3)
    
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')

    # 데이터 수집 후 저장
    # 회사이름
    company_d = []
    title_d = []
    service_d = []
    welfare_d = []

    data = soup.find("div", {"class", "wrap_jv_header"})
    if data is not None:
        company_name = data.select_one(".jv_header > a").text
        company_d = company_name
        print(company_name)

        # 공고제목
        title = data.select_one(".jv_header > h1").text
        title_d = title

        print(number, title)

        # iframe 접근 (본문 데이터 저장)
        try:
            content = driver.find_element(By.TAG_NAME, 'iframe')
            driver.switch_to.frame("iframe_content_0")
            main = driver.page_source
            soup = BeautifulSoup(main, 'html.parser')

            # 서비스 소개
            data = soup.find("div", {"class", "user_content"})
            service_introduction = data.select_one("div > div:nth-of-type(2) > div:nth-of-type(2) > div > pre").text

            # 사진으로된 iframe일때
            if not service_introduction:
                service_d = data.select_one("div > table").get_text
                
            else:
                # print(service_introduction)
                service_d = service_introduction

                # 모집부문 / 상세내용
                content = data.select_one("div > div:nth-of-type(3) > div:nth-of-type(2) ")
                content = content.select("div > dl")
                content_d = [['#']*2 for i in range(len(content))]
                c_list = [['#']*2 for i in range(len(content))]
            
                for idx,c in enumerate(content):
                    # 모집부문
                    recruitment = c.select_one("dt").text
                    c_list[idx][0] = recruitment
            
                    #detail
                    detail = c.get_text()
                    c_list[idx][1] = detail
                content_d = c_list

                # 혜택
                welfare = data.select_one("div > div:nth-of-type(4) > div:nth-of-type(2)").get_text
                welfare_d = welfare

        except:
            continue
    else:
        continue

    # 데이터 저장
    saramin_data = {
    'company_names' : company_d,
    'titles' : title_d,
    'service_introductions' : service_d,
    'contents' : content_d,
    'welfares' : welfare_d
    }  

    with open('./saramin_data.csv', 'a', encoding='utf-8', newline='') as csvfile:
        fieldnames = ['company_names', 'titles', 'service_introductions', 'contents', 'welfares']
        csvwriter = csv.DictWriter(csvfile, fieldnames=fieldnames)
        csvwriter.writerow(saramin_data)
    driver.close()

print("step2 done!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
print("데이터 저장 완료 - 크롤링 완료")