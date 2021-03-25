import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import MoviesTable from "./moviesTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { Paginate } from "../utils/paginate";
import { Link } from "react-router-dom";
import _ from "lodash";
import SearchBox from "./searchBox";
class Movies extends Component {
  state = {
    movies: "",
    genres: "",
    searchQuery: "",
    selectedGenre: null,
    pageSize: 4,
    sortColumn: { path: "title", order: "asc" },
    currentPage: 1,
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
    this.setState({
      movies: getMovies(),
      genres,
    });
  }
  handleDelete = (movie) => {
    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies });
  };
  handleHeart = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
    console.log("Movies", movies[index]);
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };
  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      selectedGenre,
      movies: AllMovies,
      genres,
      searchQuery,
      sortColumn,
    } = this.state;

    if (count === 0) return <p>There are no movies in the Database</p>;

    let filtered = AllMovies;
    if (searchQuery)
      filtered = AllMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = AllMovies.filter((m) => m.genre._id === selectedGenre._id);
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const movies = Paginate(sorted, currentPage, pageSize);
    return (
      <div className="container">
        <div className="row">
          <div className="col-3 col-md-2">
            <ListGroup
              genres={genres}
              selectedGenre={this.state.selectedGenre}
              onGenreSelect={this.handleGenreSelect}
            />
          </div>
          <div className="col">
            <div className="row">
              <Link
                to="/movies/new"
                className="btn btn-primary"
                style={{ marginBottom: "20px" }}
              >
                New Movie
              </Link>
            </div>
            <div className="row">
              <SearchBox value={searchQuery} onChange={this.handleSearch} />
              <p>Showing {filtered.length} movies in the Database</p>
              <MoviesTable
                movies={movies}
                onLike={this.handleHeart}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
                sortColumn={sortColumn}
              />
              <Pagination
                itemsCount={filtered.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={this.handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Movies;
