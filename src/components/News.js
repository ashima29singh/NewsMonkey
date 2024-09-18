import React, {useEffect, useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


const News =(props) => {
  const [articles, setArticles] = useState([])
  const [loading, setloading] = useState([true])
  const [page, setpage] = useState([1])
  const [totalResults, settotalResults] = useState([0])
  

  const capitalizeFirstLetter = (string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  
 

  const updateNews = async () =>{
    props.setProgress(30);
    const url =`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=7b1ca0f2f9884396b71b2be5129d32ce&pageSize=${props.pageSize}`;
      setloading(true)
    let data = await fetch(url);
    props.setProgress(50);
    let parsedData = await data.json();
    props.setProgress(80);
    setArticles(parsedData.articles)
    settotalResults(parsedData.totalResults)
    setloading(false)
    props.setProgress(100);
  }

  useEffect(() =>{
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
  }, [])

  

  const hanlePrevClick = async () => {
    setpage(page-1)
    updateNews();
  };

  const hanleNextClick = async () => {
    setpage(page+1)
    updateNews();
  };

  const fetchMoreData = async() => {
    setpage(page+1)
   const url =`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=7b1ca0f2f9884396b71b2be5129d32ce&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles))
    settotalResults(parsedData.totalResults)
  };


    return (
      <>
        <h2 className="text-center" style={{margin: '35px 0px', marginTop: '90px'}}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h2>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >
        <div className="container">
        <div className="row">
          {articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title}
                  description={element.description?element.description:""}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
              
            );
          })}
        </div>
        </div>
        </InfiniteScroll>
      </>
    );
  
}

News.defaultProps = {
  country: 'us',
  pageSize: 10,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News;
