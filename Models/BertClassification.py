import pandas as pd
import torch
from torch import nn
from torch.optim import Adam

from transformers import BertModel
from transformers import BertTokenizer

import numpy as np


tokenizer = BertTokenizer.from_pretrained('bert-base-cased')
labels = {
    'backend%20developer': 0,
    'software': 1,
    'system': 2,
    'database': 3,
    'network': 4,
    'Frontend%20Developer': 5,
    'Application': 6,
    'Service': 7,
    'Game%20Developer': 8,
    'AI%20Engineer': 9
}


class Dataset(torch.utils.data.Dataset):

    def __init__(self, df):
        self.labels = [labels[label] for label in df['category']]
        self.texts = [tokenizer(text,
                                padding='max_length', max_length=512, truncation=True,
                                return_tensors="pt") for text in df['text']]

    def classes(self):
        return self.labels

    def __len__(self):
        return len(self.labels)

    def get_batch_labels(self, idx):
        # Fetch a batch of labels
        return np.array(self.labels[idx])

    def get_batch_texts(self, idx):
        # Fetch a batch of inputs
        return self.texts[idx]

    def __getitem__(self, idx):

        batch_texts = self.get_batch_texts(idx)
        batch_y = self.get_batch_labels(idx)

        return batch_texts, batch_y


class BertClassifier(nn.Module):

    def __init__(self, dropout=0.5):

        super(BertClassifier, self).__init__()

        self.bert = BertModel.from_pretrained('bert-base-cased')
        self.dropout = nn.Dropout(dropout)
        self.linear = nn.Linear(768, 10)
        self.relu = nn.ReLU()

    def forward(self, input_id, mask):

        _, pooled_output = self.bert(input_ids= input_id, attention_mask=mask,return_dict=False)
        dropout_output = self.dropout(pooled_output)
        linear_output = self.linear(dropout_output)
        final_layer = self.relu(linear_output)

        return final_layer


class BertClassification:

    def __init__(self, model_path):
        self.model = BertClassifier()
        self.checkpoint = torch.load(model_path, map_location=torch.device('cpu'))
        self.optimizer = Adam(BertClassifier().parameters(), lr=1e-6)  # init optimizer

    def loader(self):
        self.model.load_state_dict(self.checkpoint['model_state_dict'])
        self.optimizer.load_state_dict(self.checkpoint['optimizer_state_dict'])

    def evaluate(self, sentence):
        sample = [['database', sentence]]
        data = pd.DataFrame(sample, columns=['category', 'text'])
        test = Dataset(data)
        test_dataloader = torch.utils.data.DataLoader(test, batch_size=2)
        device = torch.device("cpu")
        self.model.cpu()

        with torch.no_grad():
            for test_input, test_label in test_dataloader:
                mask = test_input['attention_mask'].to(device)
                input_id = test_input['input_ids'].squeeze(1).to(device)

                output = self.model(input_id, mask)
                m = nn.Softmax(dim=1)
                return m(output).cpu().numpy()[0]

