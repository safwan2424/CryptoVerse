import React, { useState } from 'react';
import { Select, Typography, Row, Col, Avatar, Card } from 'antd';
import moment from 'moment';

import {useGetCryptosQuery} from '../Services/CryptoApi';
import {useGetCryptoNewsQuery} from '../Services/CryptoNewsApi'
import Loader from './Loader';

const demoImage = 'https://rb.gy/b0cq5c';

const { Text, Title } = Typography;
const { Option } = Select;

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState('Cryptocurrency');
  const { data: cryptosData } = useGetCryptosQuery(100);
  const { data: cryptoNews, error } = useGetCryptoNewsQuery({ count: simplified ? 6 : 12 });

  if (error) return <div>Error fetching crypto news: {error.message}</div>;
  if (!cryptoNews?.data) return <Loader />;

  return (
    <Row gutter={[24, 24]}>
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className="select-news"
            placeholder="Select a Crypto"
            optionFilterProp="children"
            onChange={(value) => setNewsCategory(value)}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Option value="Cryptocurrency">Cryptocurrency</Option>
            {cryptosData?.data?.coins?.map((currency) => (
              <Option key={currency.id} value={currency.name}>
                {currency.name}
              </Option>
            ))}
          </Select>
        </Col>
      )}
      {cryptoNews?.data.map((news) => (
        <Col xs={24} sm={12} lg={8} key={news.id || news.title}> {/* Fallback to another unique value if id is not available */}
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <div className="news-image-container">
                <img src={news.thumbnail || demoImage} alt="News Thumbnail" />
                <Title className="news-title" level={4}>{news.title}</Title>
              </div>
              <p>{news.description.length > 100 ? `${news.description.substring(0, 100)}...` : news.description}</p>
              <div className="provider-container">
                <div>
                  <Avatar src={demoImage} alt="Provider" />
                 
                </div>
                <Text>{moment(news.createdAt).startOf('ss').fromNow()}</Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;
