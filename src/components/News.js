import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {
  static defaultProps = {
    country: 'us',
    pageSize: 10,
    category: 'general',
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
  }

  async updateNews(){
    const url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=7b1ca0f2f9884396b71b2be5129d32ce&pageSize=${this.props.pageSize}`;
      this.setState({loading:true})
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({ articles: parsedData.articles,totalResults: parsedData.totalResults, loading: false });
  }

  async componentDidMount() {
  this.updateNews();
  }

  hanlePrevClick = async () => {
    this.setState({page: this.state.page-1});
    this.updateNews();
  };

  hanleNextClick = async () => {
    this.setState({page: this.state.page+1});
    this.updateNews();
  };

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center">NewsMonkey - Top Headlines</h1>
        {this.state.loading && <Spinner/>}
        <div className="row">
          {!this.state.loading && this.state.articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title}
                  description={element.description}
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
        <div className="container d-flex justify-content-between">
          <button disabled={this.state.page <=1}type="button" className="btn btn-dark"onClick={this.hanlePrevClick}>&larr; Previous</button>
          <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)}type="button"className="btn btn-dark"onClick={this.hanleNextClick}>Next &rarr;</button>
        </div>
      </div>
    );
  }
}
export default News;
