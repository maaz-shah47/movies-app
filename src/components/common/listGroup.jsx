import React from "react";

const ListGroup = (props) => {
  const { genres: items, textProperty, selectedGenre, valueProperty } = props;

  return (
    <React.Fragment>
      <ul className="list-group">
        {items.map((item) => (
          <li
            key={item[valueProperty]}
            onClick={() => props.onGenreSelect(item)}
            style={{ cursor: "pointer" }}
            className={
              item === selectedGenre
                ? "list-group-item active"
                : "list-group-item"
            }
          >
            {item[textProperty]}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

ListGroup.defaultProps = {
  valueProperty: "_id",
  textProperty: "name",
};
export default ListGroup;
