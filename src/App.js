import React, { useEffect, useState } from "react";
import './App.css'
import tmdb from "./tmdb"
import MoviesRow from './components/MoviesRow'
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header'

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(
    () => {
      const loadAll = async () => {
        let list = await tmdb.getHomeList();
        setMovieList(list);

        let originals = list.filter(i => i.slug === 'originals')
        let randomChosem = Math.floor(Math.random() * (originals[0].items.results?.length - 1))
        let chosen = originals[0].items.results[randomChosem]
        let chosenInfo = await tmdb.getMovieInfo(chosen.id, 'tv')

        setFeaturedData(chosenInfo)
      }
      loadAll();
    }, []);


  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }

  }, [])

  return (
    <div className="page">
      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MoviesRow key={key} title={item.title} items={item.items} />
        ))}

      </section>
      <footer>
        Feito com <span role='img' aria-label='coração'>💗</span> Amanda Wisnieski <br />
        Direitos de imagem para Netflix<br />
        Dados pegos do site Themoviedb.org

      </footer>
      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://rchandru.com/images/portfolio/modals/m-loading.gif" />
        </div>}


    </div>
  )
};