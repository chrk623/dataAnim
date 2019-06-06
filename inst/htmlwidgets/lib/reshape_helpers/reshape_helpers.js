console.log("helperstidyr.js loaded");

function loadScript(url) {
  var script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
}

function storeit() {

}

function vabline(v) {
  d3.select("svg")
    .append("line")
    .attr("x1", v)
    .attr("x2", v)
    .attr("y1", -9999)
    .attr("y2", 9999)
    .style("stroke-width", "10px")
    .style("fill", "red");
}

function habline(h) {
  d3.select("svg")
    .append("line")
    .attr("x1", -9999)
    .attr("x2", 9999)
    .attr("y1", h)
    .attr("y2", h)
    .style("stroke-width", "10px")
    .style("fill", "red");
}

function rectt() {
  d3.select("svg")
    .append("rect")
    .attr("x", 100)
    .attr("y", 100)
    .attr("width", 100)
    .attr("height", 100);
}

function hi() {
  console.log("hi")
}

function get_translation(obj, type) {
  if (type == "node") {
    string = d3.select(obj).attr("transform");
  } else {
    string = obj.attr("transform");
  }

  if (string === null) {
    return ([0, 0]);
  } else {
    string = string.substring(string.indexOf("(") + 1,
      string.indexOf(")")).split(",");
    return string.map((d, i) => parseInt(d));
  }
}


function clone_everything(selector) {
  var node = d3.select(selector).node();
  return d3.select(node.parentNode.insertBefore(node.cloneNode(true), node.nextSibling));
};

//  function a_seq(from, to, by = 1) {
//    let n = (to - from + 1) / by
//   return Array.from(Array(n), (x, index) => index + 1)
//  }

function a_intersect(a, b) {
  var t;
  if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
  return a.filter(function (e) {
    return b.indexOf(e) > -1;
  });
}

function a_intersect2(a, b) {
  var t;
  if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
  return a.filter(function (e) {
    return b.indexOf(e) > -1;
  }).filter(function (e, i, c) { // extra step to remove duplicates
    return c.indexOf(e) === i;
  });
}

function a_outersect(a, b) {
  return a.filter(x => !b.includes(x))
}

function arr_last(arr) {
  return arr.slice(-1)[0];
}

function arr_nth(arr, n) {
  return arr.filter(function (value, index, ar) {
    index++;
    return (index % n == 0);
  });
}

function arr_sum(arr) {
  let reducer = (accumulator, currentValue) => accumulator + currentValue;
  return arr.reduce(reducer);
}

function arr_scale(arr, sc) {
  arr = arr.map((d, i) => {
    return (sc(d))
  });
  return arr;
}

function parent_setclass(sel, s_class, level) {
  // s_class = desired class
  // level = how many levels up to set
  for (var i = 0; i < level; i++) {
    sel = sel.select(function () {
      return this.parentNode;
    });
    sel.classed(s_class, true);
  }
}

function insertnodeinto(nn, seltxt) {
  d3.select(seltxt)
    .insert(function () {
      return nn;
    })
}

function db_pulse_rect(nodes, col, tran_time = 1000, delay_time = 0, keep_highlighted = false) {
  // input is a rect node not col node or selection

  // pulse the rects twice with the duration of tran_time
  if (nodes.length === undefined) {
    let og_col = d3.select(nodes).style("fill");
    for (var j = 0; j < 4; j++) {
      if (j % 2 === 0) {
        d3.select(nodes)
          .transition()
          .duration(tran_time / 4)
          .delay(delay_time + tran_time / 4 * j)
          .style("fill", col);
      } else {
        d3.select(nodes)
          .transition()
          .duration(tran_time / 4)
          .delay(delay_time + tran_time / 4 * j)
          .style("fill", og_col);
      }
    }

    if (keep_highlighted === true) {
      d3.select(nodes)
        .transition()
        .delay(delay_time + tran_time)
        .style("fill", col);
    }
  } else {
    nodes.forEach(function (d, i) {
      for (var j = 0; j < 4; j++) {
        if (j % 2 === 0) {
          d3.select(d)
            .transition()
            .duration(tran_time / 4)
            .delay(delay_time + tran_time / 4 * j)
            .style("fill", col);
        } else {
          d3.select(d)
            .transition()
            .duration(tran_time / 4)
            .delay(delay_time + tran_time / 4 * j)
            .style("fill", null);
        }
      }
      if (keep_highlighted === true) {
        d3.select(d)
          .transition()
          .delay(delay_time + tran_time)
          .style("fill", col);
      }
    })
  }
}

function db_pulse_text(nodes, col, tran_time = 1000, delay_time = 0, keep_highlighted = false) {
  // input is a rect node not col node or selection

  // pulse the rects twice with the duration of tran_time
  if (nodes.length === undefined) {
    let og_col = d3.select(nodes).style("fill");
    for (var j = 0; j < 4; j++) {
      if (j % 2 === 0) {
        d3.select(nodes)
          .transition()
          .duration(tran_time / 4)
          .delay(delay_time + tran_time / 4 * j)
          .style("fill", col);
      } else {
        d3.select(nodes)
          .transition()
          .duration(tran_time / 4)
          .delay(delay_time + tran_time / 4 * j)
          .style("fill", og_col);
      }
    }

    if (keep_highlighted === true) {
      d3.select(nodes)
        .transition()
        .delay(delay_time + tran_time)
        .style("fill", col);
    }
  } else {
    nodes.forEach(function (d, i) {
      for (var j = 0; j < 4; j++) {
        if (j % 2 === 0) {
          d3.select(d)
            .transition()
            .duration(tran_time / 4)
            .delay(delay_time + tran_time / 4 * j)
            .style("fill", col);
        } else {
          d3.select(d)
            .transition()
            .duration(tran_time / 4)
            .delay(delay_time + tran_time / 4 * j)
            .style("fill", null);
        }
      }
      if (keep_highlighted === true) {
        d3.select(d)
          .transition()
          .delay(delay_time + tran_time)
          .style("fill", col);
      }
    })
  }
}


function rect_mid_cord(nodes) {
  // input is node not selection
  // returns the coord of the mid point of the rectangle
  let result = new Array();
  if (nodes.length == undefined) {
    x = parseFloat(d3.select(nodes).attr("x"));
    y = parseFloat(d3.select(nodes).attr("y"));
    wd = parseFloat(d3.select(nodes).attr("width"));
    ht = parseFloat(d3.select(nodes).attr("height"));
    result.push({
      x: x + wd / 2,
      y: y + ht / 2
    });
  } else {
    nodes.forEach(function (d, i) {
      x = parseFloat(d3.select(d).attr("x"));
      y = parseFloat(d3.select(d).attr("y"));
      wd = parseFloat(d3.select(d).attr("width"));
      ht = parseFloat(d3.select(d).attr("height"));
      result.push({
        x: x + wd / 2,
        y: y + ht / 2
      });
    })
  }
  return result;
}

function nkeycol_width(id) {
  let temp_nodes = d3.select(`.${id}_rows`)
    .selectAll(`.${id}_cols:not(.${id}_cols_key`)
    .select("rect").nodes();
  let store = new Array()
  temp_nodes.forEach(function (d, i) {
    store.push(parseFloat(d3.select(d).attr("width")));
  })
  return store;
}


function move_text(to_sel, from_node, tran_time, delay_time) {
  // from is a column group node, to is a rectangle selection

  // parent_setclass(d3.select(from_node), "moved", 1);

  d3.select(from_node)
    .select("text")
    .classed("moved", true)
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .on("start", function (d, i) {
      d3.select(this)
        .clone(true);
    })
    .attr("x", to_sel.attr("x"))
    .attr("y", to_sel.attr("y"))
    .on("end", function (d, i) {
      d3.select(this)
        .remove();
    });
}

function movexy_rect(node, x, y, width, tran_time, delay_time,
  insert_txt = null, remove = false) {
  // input node should be something like .x_col where there are rects inside
  if (y === null) {
    y = d3.select(node)
      .select("rect")
      .attr("y")
  }
  // parent_setclass(d3.select(node), "moved", 1);

  if (insert_txt != null || insert_txt != undefined) {

  }
  node = d3.select(node)
    .select("rect")
    .clone(true)
    .node();

  d3.select(".x_rows")
    .insert(function () {
      return node;
    })
  //

  d3.select(node).classed("moved", true)
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .attr("x", x)
    .attr("y", y)
    .attr("width", width)
    .on("end", function (d, i) {
      if (remove === true) {
        d3.select(this)
          .remove();
      }
    });
}

function movexy_text(node, x, y, adj_y = null, width, tran_time, delay_time,
  insert_txt = null, remove = false) {
  // input node should be something like .x_col where there are text inside

  parent_setclass(d3.select(node), "moved", 1);

  // common adj_y is the height of a rect so the ycord can be in the middle
  // of the rectangle
  if (y === null) {
    y = d3.select(node)
      .select("text")
      .attr("y");
  }
  if (adj_y !== null) {
    y = y + 0.5 * adj_y;
  }
  node = d3.select(node)
    .select("text")
    .clone(true);

  node.classed("moved", true)
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .attr("x", parseInt(x) + 0.5 * width)
    .attr("y", y)
    .on("end", function (d, i) {
      if (remove === true) {
        d3.select(this)
          .remove();
      }
    });
}

function movexy_cell(node, rx, ry, tx, ty, adj_ty = null, width, tran_time, delay_time,
  location = null, msg = undefined, remove = false) {
  // input node should be something like .x_col where there are text inside
  // r-x/y is rect xy, t-x/y is for text xy
  // common adj_y is the height of a rect so the ycord can be in the middle of the rectangle

  // clone node
  rnode = d3.select(node)
    .select("rect")
    .clone(true)
    .node();
  tnode = d3.select(node)
    .select("text")
    .clone(true)
    .node();

  // rect module
  if (ry === null) {
    ry = d3.select(node)
      .select("rect")
      .attr("y")
  }

  d3.select(rnode)
    // .select("rect")
    //.classed("moved", true)
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .attr("x", rx)
    .attr("y", ry)
    .attr("width", width)
    .on("end", function (d, i) {
      if (location != null) {
        base = this;
        d3.select(location)
          .insert(function () {
            return base;
          })
      }
      // if (remove === true) {
      //   d3.select(this)
      //     .remove();
      // }
    });


  // text module
  if (ty === null) {
    ty = d3.select(node)
      .select("text")
      .attr("y");
  }
  if (adj_ty !== null) {
    ty = ty + 0.5 * adj_ty;
  }

  d3.select(tnode)
    // .select("text")
    //.classed("moved", true)
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .attr("x", parseFloat(tx) + 0.5 * width)
    .attr("y", ty)
    .on("end", function (d, i) {
      if (location != null) {
        base = this;
        d3.select(location)
          .insert(function () {
            return base;
          })
      }
      // if (remove === true) {
      //   d3.select(this)
      //     .remove();
      // }
    });
  return delay_time + tran_time;
}



function tbl_mid_cord(c1, c2, xy = true) {
  // return the midpoint of the two tables
  // c1 and c2 are the identifiers of the two tables by class

  right = d3.select(`.${c2}_tbl>.${c2}_rows:last-child`)
    .select("rect");
  right_x = parseInt(right.attr("x"));
  right_y = parseInt(right.attr("y")) + parseInt(right.attr("height"));


  left = d3.select(`.${c1}_tbl`)
    .select(`.${c1}_cols_last`)
    .select("rect");
  left_y = parseInt(left.attr("y"));
  if (xy === true) {
    let right_rect = d3.select(".y_rows")
      .selectAll(".y_cols:not(.y_cols_key)")
      .nodes();
    let right_w = 0;
    right_rect.forEach(function (d, i) {
      // currect rect in i'th iteration (loop over cols)
      cur_rect = d3.select(d).select("rect");
      right_w = right_w + parseFloat(cur_rect.attr("width"));
    })
    left_x = parseInt(left.attr("x")) + parseInt(left.attr("width")) + right_w;
  } else {
    left_x = parseInt(left.attr("x")) + parseInt(left.attr("width"));
  }

  return ({
    x: (right_x + left_x) / 2,
    y: (right_y + left_y) / 2
  });
}



function msg_box2(x, y, width = null, height = null, msg, start_time = 0, tran_time = 2000, pause_ratio = 0.5, center = true) {
  // if(msg == "gettimeonly") {
  //   return start_time + tran_time + pause_time;
  // }
  pause_time = tran_time * pause_ratio;
  tran_time = tran_time - pause_time;
  if (width == null) {
    d3.select(".x_rows")
      .selectAll("rect")
      .each(function (d, i) {
        cur_width = d3.select(this).attr("width");
        if (i == 0) {
          width = cur_width;
        } else {
          if (cur_width < width) {
            width = cur_width;
          }
        }
      });
    width = width * 3;
  }
  if (height == null) {
    height = parseFloat(d3.select("rect").attr("height")) * 2;
  }
  // if center == true
  // adjust x and y so the msg box is in the middle of the given x y cord
  if (center === true) {
    x = x - width / 2;
    y = y - height / 2;
  }
  //  text attrs
  let txt_x = x + width / 2;
  let txt_y = y + height / 2;
  let txt_fontsize = d3.select("text")
    .style("font-size");

  // create msg box group
  msgbox = d3.select("svg")
    .append("g")
    .attr("class", "msgbox");
  if (msg == "gettimeonly") {
    msgbox
      .style("opacity", 0)
  }
  // attrs in box
  msgbox.append("rect")
    .transition()
    .delay(start_time)
    .duration(tran_time)
    .attr("x", x)
    .attr("y", y)
    .attr("width", width)
    .attr("height", height);
  // text in msg box
  msgbox.append("text")
    .attr("x", txt_x)
    .attr("y", txt_y)
    .style("font-size", 0)
    .transition()
    .delay(start_time)
    .duration(tran_time)
    .style("font-size", txt_fontsize)
    .text(msg);



  delay_time = start_time + tran_time;

  msgbox
    .transition()
    .delay(delay_time)
    .duration(pause_time)
    .on("end", function () {
      d3.select(this)
        .remove();
    })

  return delay_time + pause_time;
}


function animate_line(x1, x2, y1, y2, tran_time = 1000, start_time = 0) {
  // animate line from x1,y1 to x2,y2, duration = tran_time.
  // then remove the line

  // create line
  cur_line = d3.select("svg")
    .append("line")
    .attr("x1", x1)
    .attr("x2", x1)
    .attr("y1", y1)
    .attr("y2", y1);
  // move line
  cur_line.transition()
    .delay(start_time)
    .duration(tran_time)
    .attr("x2", x2)
    .attr("y2", y2)
    .on("end", function () {
      d3.select(this)
        .remove();
    });
}

function iso_msgbox(x, y, width = null, height = null, msg, start_time = 0, tran_time = 2000, isomsg_ratio = 0.5, pause_time = 1000, center = true) {
  // isomsg ratio is iso:msg, so ratio 0.7 mean 30% of tran_time will be msg_trantime
  d3.selectAll("svg > *")
    .transition()
    .delay(start_time)
    .style("opacity", 0.3)
    .transition()
    .delay(tran_time * 0.8)
    .on("end", function () {
      d3.select(this)
        .transition()
        .duration(tran_time * 0.15)
        .style("opacity", 1);
    });
  // tran_time = tran_time - pause_time;
  // msg_box(x, y, width, height, msg, tran_time * isomsg_ratio, tran_time * (1 - isomsg_ratio), pause_time, center);
  msg_box2(x, y, width, height, msg, start_time, tran_time, isomsg_ratio, center);
}



function draw_table(input, x_start, y_start, x_cord, width, height, name, key_col) {
  // topleft y coords for the reactangles
  let y_cord = 0 - height;

  // row,col,tbl name
  let tbl_name = `${name}_tbl`;
  let row_name = `${name}_rows`
  let col_name = `${name}_cols`
  let key_name = d3.keys(input);
  // get the scaled new x_cords
  let new_x_cord = x_cord.map((d, i) => d + x_start);
  let new_y_cord = Array();

  // draw the tables, (rectangles)
  d3.select("svg")
    .append("g")
    .attr("class", tbl_name)
    .selectAll("g")
    .data(input)
    .enter()
    .append("g")
    .attr("class", row_name)
    .each(function (d, i) {
      var header = d3.select(this);
      // create the y cords
      new_y_cord.push(height * i + y_start);
      d3.keys(d).forEach(function (key, j) {
        header
          .append("rect")
          .attr("width", width[j])
          .attr("height", height)
          .attr("x", new_x_cord[j])
          .attr("y", new_y_cord[i])
          .style("fill", "white");
      });
    });

  // text in rectangles
  // wrap all rects with g's for the columns
  d3.selectAll(`.${row_name}`)
    .selectAll("rect").each(function (d, i) {
      var el = this;
      d3.select(el.parentNode)
        .insert("g")
        .attr("class", col_name)
        .append(function () {
          return el;
        });
    });
  // give the key cols class key
  // var key_rect = document.querySelectorAll(`.${col_name}:first-of-type`);
  // var key_rect = document.querySelectorAll(`.${col_name}:nth-of-type(${key_col})`);
  var key_rect = d3.selectAll(`.${col_name}:nth-of-type(${key_col})`).nodes();
  d3.selectAll(key_rect)
    .classed(`${col_name}_piv`, true)
    .classed("piv_col", true);
  // similarly for the last col
  // var last_rect = document.querySelectorAll(`.${col_name}:last-of-type`);
  var last_rect = d3.selectAll(`.${col_name}:last-of-type`).nodes();
  d3.selectAll(last_rect)
    .classed(`${col_name}_last`, true)
    .classed("last_col", true);

  // the actual texts
  d3.selectAll(`.${row_name}`).each(function (d, i) {
    input_i = input[i];
    input_i_key = d3.keys(input_i);
    d3.select(this).selectAll(`.${col_name}`).each(function (d, j) {
      d3.select(this)
        .append("text")
        .text(input_i[input_i_key[j]])
        .attr("x", new_x_cord[j] + width[j] * 0.5)
        .attr("y", new_y_cord[i] + height * 0.5)
        .style("font-size", height * 0.5)
        .on("end", function () {
          d3.select(this)
            .remove();
        });
    })
  });
  d3.select(`.${row_name}`).selectAll("text").style("font-size", height * 0.5);

  return ({
    x: new_x_cord,
    y: new_y_cord
  });
};

function draw_table_rectonly(input, x_start, y_start, x_cord, width, height, name, key_col, pivot_text = false) {
  // topleft y coords for the reactangles
  let y_cord = 0 - height;

  // row,col,tbl name
  let tbl_name = `${name}_tbl`;
  let row_name = `${name}_rows`
  let col_name = `${name}_cols`
  let key_name = d3.keys(input);
  // get the scaled new x_cords
  let new_x_cord = x_cord.map((d, i) => d + x_start);
  let new_y_cord = Array();

  // draw the tables, (rectangles)
  d3.select("svg")
    .append("g")
    .attr("class", tbl_name)
    .selectAll("g")
    .data(input)
    .enter()
    .append("g")
    .attr("class", row_name)
    .each(function (d, i) {
      var header = d3.select(this);
      // create the y cords
      new_y_cord.push(height * i + y_start);
      d3.keys(d).forEach(function (key, j) {
        header
          .append("rect")
          .attr("width", width[j])
          .attr("height", height)
          .attr("x", new_x_cord[j])
          .attr("y", new_y_cord[i])
          .style("fill", "white");
      });
    });

  // text in rectangles
  // wrap all rects with g's for the columns
  d3.selectAll(`.${row_name}`)
    .selectAll("rect").each(function (d, i) {
      var el = this;
      d3.select(el.parentNode)
        .insert("g")
        .attr("class", col_name)
        .append(function () {
          return el;
        });
    });
  // give the key cols class key
  // var key_rect = document.querySelectorAll(`.${col_name}:first-of-type`);
  // var key_rect = document.querySelectorAll(`.${col_name}:nth-of-type(${key_col})`);
  var key_rect = d3.selectAll(`.${col_name}:nth-of-type(${key_col})`).nodes();
  d3.selectAll(key_rect)
    .classed(`${col_name}_piv`, true)
    .classed("piv_col", true);
  // similarly for the last col
  // var last_rect = document.querySelectorAll(`.${col_name}:last-of-type`);
  var last_rect = d3.selectAll(`.${col_name}:last-of-type`).nodes();
  d3.selectAll(last_rect)
    .classed(`${col_name}_last`, true)
    .classed("last_col", true);
  // the actual texts
  d3.selectAll(`.${row_name}`).each(function (d, i) {
    input_i = input[i];
    input_i_key = d3.keys(input_i);
    d3.select(this).selectAll(`.${col_name}`).each(function (d, j) {
      if (pivot_text === true) {
        if (j == 0) {
          d3.select(this)
            .append("text")
            .text(input_i[input_i_key[j]])
            .attr("x", new_x_cord[j] + width[j] * 0.5)
            .attr("y", new_y_cord[i] + height * 0.5)
            .style("font-size", height * 0.5)
            .on("end", function () {
              d3.select(this)
                .remove();
            });
        }
      }
    })
  });
  d3.select(`.${row_name}`).selectAll("text").style("font-size", height * 0.5);
  return ({
    x: new_x_cord,
    y: new_y_cord
  });
};


function prepare_gather(start_xy, col_ind, key, value, key_width, value_width, height, start_time = 0, speed = 1) {
  let tran_time = 2000 / speed;
  let delay_time = start_time;
  anim_header = d3.select("svg")
    .append("g")
    .attr("id", "anim_header");
  // key text
  anim_header
    .append("text")
    .attr("id", "key_txt1")
    .attr("x", start_xy["x"])
    .attr("y", start_xy["y"])
    .style("opacity", 0)
    .style("text-anchor", "start")
    .style("font-size", height * 0.6)
    .text("Make a new column ");

  // key rect
  key_rect_x = d3.select("#key_txt1").node().getComputedTextLength() * 1.025 +
    start_xy["x"];
  key_rect_y = start_xy["y"] - height / 2;
  anim_header.append("g")
    .attr("id", "key_el")
    .append("rect")
    .style("opacity", 0)
    .attr("id", "key_rect")
    .attr("x", key_rect_x)
    .attr("y", key_rect_y)
    .attr("width", key_width)
    .attr("height", height);
  d3.select("#key_el")
    .append("text")
    .attr("id", "key_text")
    .attr("x", key_rect_x + key_width / 2)
    .attr("y", key_rect_y + height / 2)
    .text(key)
    .style("opacity", 0)
    .style("font-size", height * 0.5);
  // addition text
  anim_header.select("#key_txt1")
    .append("tspan")
    .attr("id", "key_txt2")
    .attr("x", key_rect_x + key_width * 1.05)
    .text(" to contain the old column names ")
  // fade in all sentences before moving up the old column header
  d3.select("#key_txt1")
    .transition()
    .delay(start_time)
    .duration(tran_time)
    .style("opacity", 1);
  d3.select("#key_rect")
    .transition()
    .delay(start_time)
    .duration(tran_time)
    .style("opacity", 1);
  d3.select("#key_text")
    .transition()
    .delay(start_time)
    .duration(tran_time)
    .style("opacity", 1);
  delay_time = delay_time + tran_time;

  // move old column names up to title
  key_rect_x = key_rect_x + d3.select("#key_txt2").node().getComputedTextLength() + key_width * 1.1;
  adj_width = 0;
  adj_text_x = 0;
  col_ind.forEach(function (d, i) {
    cur_head_move = d3.select(".o_rows")
      .selectAll(`.o_cols:nth-child(${d})`);
    // move rect
    cur_move_rect = cur_head_move.select("rect")
      .clone(true);
    cur_move_text = cur_head_move.select("text")
      .clone(true);
    insertnodeinto(cur_move_rect.node(), "#anim_header");
    insertnodeinto(cur_move_text.node(), "#anim_header");

    cur_move_rect
      .transition()
      .delay(delay_time)
      .duration(tran_time)
      .attr("x", key_rect_x + adj_width * 1.05)
      .attr("y", key_rect_y);
    // move text
    adj_text_x = parseFloat(cur_head_move.select("rect").attr("width"));
    cur_move_text
      .transition()
      .delay(delay_time)
      .duration(tran_time)
      .attr("x", key_rect_x + adj_width * 1.05 + adj_text_x / 2)
      .attr("y", key_rect_y + height / 2);
    adj_width = adj_text_x;
  })
  delay_time = delay_time + tran_time;

  // adjust start_xy[y] for next line
  start_xy["y"] = start_xy["y"] + height * 1.2;
  // // value text
  anim_header
    .append("text")
    .attr("id", "value_txt")
    .attr("x", start_xy["x"])
    .attr("y", start_xy["y"])
    .style("opacity", 0)
    .style("text-anchor", "start")
    .style("font-size", height * 0.6)
    .text("Make a new column ");
  // value rect
  value_rect_x = d3.select("#value_txt").node().getComputedTextLength() * 1.025 +
    start_xy["x"];
  value_rect_y = start_xy["y"] - height / 2;
  anim_header.append("g")
    .attr("id", "value_el")
    .append("rect")
    .style("opacity", 0)
    .attr("id", "value_rect")
    .attr("x", value_rect_x)
    .attr("y", value_rect_y)
    .attr("width", value_width)
    .attr("height", height);
  d3.select("#value_el")
    .append("text")
    .style("opacity", 0)
    .attr("id", "value_text")
    .attr("x", value_rect_x + value_width / 2)
    .attr("y", value_rect_y + height / 2)
    .text(value)
    .style("font-size", height * 0.5);
  // add additional text
  anim_header.select("#value_txt")
    .append("tspan")
    .attr("id", "key_txt2")
    .attr("x", value_rect_x + value_width * 1.05)
    .text(" to store the values from the old columns.")
  // fade in all sentences
  d3.select("#value_txt")
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .style("opacity", 1);
  d3.select("#value_rect")
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .style("opacity", 1);
  d3.select("#value_text")
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .style("opacity", 1);
  delay_time = delay_time + tran_time;

  return d3.select("svg")
    .transition().delay(delay_time);
}

function make_rtbl_g(data) {
  // create a group for r_tbl to contain the new elements
  d3.select("svg")
    .append("g")
    .attr("class", "r_tbl");
  // create rows
  d3.keys(data).forEach(function (d, i) {
    cur_row = d3.select(".r_tbl")
      .append("g");
    cur_row.attr("class", "r_rows");
    // create cols
    // d3.keys(data[d]).forEach(function (d2, i2) {
    //   cur_row.append("g")
    //     .attr("class", "r_cols");
    // })
  })
}

function gather_anim_pivot(tbl_mid_xy, current_chunk, piv_ind_old = 1, piv_ind_new = 1, speed = 1, start_time = 0, msg = false, first = false) {
  let delay_time = start_time;
  let tran_time = 2000 / speed;
  let tran_time2 = 3000 / speed;
  let iso_time = 4000 / speed;
  let pause_time = 1500 / speed;
  let height = parseFloat(d3.select("rect").attr("height"));

  // define old pivot
  let o_pivot_cols = d3.selectAll(".o_rows")
    .selectAll(`.o_cols:nth-child(${piv_ind_old})`)
    .nodes();
  let o_pivot_header = o_pivot_cols[0];
  let o_pivot_header_rect = d3.select(o_pivot_header)
    .select("rect").node();
  o_pivot_cols.shift();
  let o_pivot_els = o_pivot_cols;
  // define new pivot
  let r_pivot_header = d3.select(".r_rows")
    .selectAll(`.r_cols:nth-child(${piv_ind_old})`)
    .node();
  let r_pivot_header_rect = d3.select(r_pivot_header)
    .select("rect").node();
  let r_pivot_els = d3.selectAll(current_chunk)
    .selectAll(`.r_cols:nth-child(${piv_ind_new})`)
    .nodes();

  if (first === true) {
    // make r table appear
    d3.selectAll(".r_rows")
      .transition()
      .delay(delay_time)
      .duration(tran_time)
      .style("opacity", 1);
    delay_time = delay_time + tran_time;
  }
  if (msg === true) {
    // msg for starting animation
    iso_msgbox(tbl_mid_xy["x"], tbl_mid_xy["y"], height * 10, height, "Start wide to long transformation", delay_time, iso_time, 0.5, pause_time);
    delay_time = delay_time + iso_time;
  }
  // pulse and link pivot header from both tables
  db_pulse_rect(o_pivot_header_rect, "yellow", tran_time, delay_time);
  db_pulse_rect(r_pivot_header_rect, "yellow", tran_time, delay_time);
  old_xy = rect_mid_cord(o_pivot_header_rect)[0];
  new_xy = rect_mid_cord(r_pivot_header_rect)[0];
  animate_line(old_xy["x"], new_xy["x"], old_xy["y"], new_xy["y"], tran_time, delay_time);
  delay_time = delay_time + tran_time;
  // move pivot from otbl to rtbl
  o_pivot_els.forEach(function (d, i) {
    new_rect = d3.select(r_pivot_els[i])
      .select("rect");
    new_x = parseFloat(new_rect.attr("x"));
    new_y = parseFloat(new_rect.attr("y"));
    new_wd = parseFloat(new_rect.attr("width"));
    // move rect
    d3.select(d).select("rect")
      .clone(true)
      .transition()
      .delay(delay_time)
      .duration(tran_time)
      .attr("x", new_x)
      .attr("y", new_y)
      .on("end", function () {
        d3.select(this)
          .remove();
      })
    // move text
    d3.select(d).select("text")
      .clone(true)
      .style("opacity", 0)
      .transition()
      .delay(delay_time)
      .duration(tran_time)
      .style("opacity", 1)
      .attr("x", new_x + new_wd / 2)
      .attr("y", new_y + height / 2)
      .on("end", function () {
        insertnodeinto(d3.select(this).node(), ".r_tbl");
      })

  })
  delay_time = delay_time + tran_time;


  return delay_time;
}

function gather_anim_key(tbl_mid_xy, current_chunk, col, col_ind, key, key_ind, speed = 1, start_time = 0, msg = false) {
  let delay_time = start_time;
  let tran_time = 2000 / speed;
  let tran_time2 = 3000 / speed;
  let iso_time = 4000 / speed;
  let pause_time = 1500 / speed;
  let height = parseFloat(d3.select("rect").attr("height"));
  // define key els from both table
  let o_key_header = d3.select(".o_rows").select(`.o_cols:nth-child(${col_ind})`).node();
  let r_key_els = d3.selectAll(current_chunk).select(`.r_cols:nth-child(${key_ind})`).nodes();

  if (msg === true) {
    // msg for starting animation
    iso_msgbox(tbl_mid_xy["x"], tbl_mid_xy["y"], height * 10, height, `Move accross ${col} under ${key}`,
      delay_time, iso_time, 0.5, pause_time);
    delay_time = delay_time + iso_time;
  }

  // animate line from old header to new key loc (eg english to subject cols/rows)
  o_key_header_rect = d3.select(o_key_header).select("rect").node();
  o_key_header_text = d3.select(o_key_header).select("text").node();
  base_xy = rect_mid_cord(o_key_header_rect)[0];
  db_pulse_rect(o_key_header_rect, "yellow", tran_time, delay_time);
  r_key_els.forEach(function (d, i) {
    // line and pulse
    new_rect = d3.select(d).select("rect").node();
    new_xy = rect_mid_cord(new_rect)[0];
    db_pulse_rect(new_rect, "yellow", tran_time, delay_time);
    animate_line(base_xy["x"], new_xy["x"], base_xy["y"], new_xy["y"], tran_time, delay_time);
  })
  delay_time = delay_time + tran_time;

  // move rect and text
  r_key_els.forEach(function (d, i) {
    // line and pulse
    new_rect = d3.select(d).select("rect");
    new_x = parseFloat(new_rect.attr("x"));
    new_y = parseFloat(new_rect.attr("y"));
    new_wd = parseFloat(new_rect.attr("width"));

    d3.select(o_key_header_rect)
      .clone(true)
      .style("opacity", 0)
      .transition()
      .delay(delay_time)
      .duration(tran_time)
      .style("opacity", 1)
      .attr("x", new_x)
      .attr("y", new_y)
      .attr("width", new_wd)
      .on("end", function () {
        d3.select(this)
          .remove();
      })

    d3.select(o_key_header_text)
      .clone(true)
      .style("opacity", 0)
      .transition()
      .delay(delay_time)
      .duration(tran_time)
      .style("opacity", 1)
      .attr("x", new_x + new_wd / 2)
      .attr("y", new_y + height / 2)
      .on("end", function () {
        insertnodeinto(d3.select(this).node(), ".r_tbl")
      })
  })
  delay_time = delay_time + tran_time;

  return delay_time;
}

function gather_anim_value(tbl_mid_xy, current_chunk, col, col_ind, value, value_ind, speed = 1, start_time = 0, msg = false) {
  d3.selectAll(".r_rows").style("opacity", 1)
  let delay_time = start_time;
  let tran_time = 2000 / speed;
  let tran_time2 = 3000 / speed;
  let iso_time = 4000 / speed;
  let pause_time = 1500 / speed;
  let height = parseFloat(d3.select("rect").attr("height"));
  // define key els from both table
  let o_value_els = d3.selectAll(".o_rows").selectAll(`.o_cols:nth-child(${col_ind})`).nodes();
  o_value_els.shift(); // remove header
  let r_value_els = d3.selectAll(current_chunk).select(`.r_cols:nth-child(${value_ind})`).nodes();

  if (msg === true) {
    // msg for starting animation
    iso_msgbox(tbl_mid_xy["x"], tbl_mid_xy["y"], height * 15, height, `Move the values under ${col} into the ${value} column`,
      delay_time, iso_time, 0.5, pause_time);
    delay_time = delay_time + iso_time;
  }

  // move rects
  r_value_els.forEach(function (d, i) {
    base_rect = d3.select(o_value_els[i]).select('rect');
    base_text = d3.select(o_value_els[i]).select('text');

    new_rect = d3.select(d).select("rect");
    new_x = parseFloat(new_rect.attr("x"));
    new_y = parseFloat(new_rect.attr("y"));
    new_wd = parseFloat(new_rect.attr("width"));

    base_rect.clone(true)
      .style("opacity", 0)
      .transition()
      .delay(delay_time)
      .duration(tran_time)
      .style("opacity", 1)
      .attr("x", new_x)
      .attr("y", new_y)
      .attr("width", new_wd)
      .on("end", function () {
        d3.select(this)
          .remove();
      });

    base_text.clone(true)
      .style("opacity", 0)
      .transition()
      .delay(delay_time)
      .duration(tran_time)
      .style("opacity", 1)
      .attr("x", new_x + new_wd / 2)
      .attr("y", new_y + height / 2)
      .on("end", function () {
        insertnodeinto(d3.select(this).node(), ".r_tbl")
      })
  })
  delay_time = delay_time + tran_time;

  return delay_time;
}

function prepare_spread(start_xy, key, value, key_ind, key_width, value_width, key_seq, height, start_time = 0, speed = 1) {
  let tran_time = 2000 / speed;
  let delay_time = start_time;
  anim_header = d3.select("svg")
    .append("g")
    .attr("id", "anim_header");
  // key text
  anim_header
    .append("text")
    .attr("id", "key_txt1")
    .attr("x", start_xy["x"])
    .attr("y", start_xy["y"])
    .style("opacity", 0)
    .style("text-anchor", "start")
    .style("font-size", height * 0.6)
    .text("Use column ");
  // key rect
  key_rect_x = d3.select("#key_txt1").node().getComputedTextLength() * 1.025 +
    start_xy["x"];
  key_rect_y = start_xy["y"] - height / 2;
  anim_header.append("g")
    .attr("id", "key_el")
    .append("rect")
    .style("opacity", 0)
    .attr("id", "key_rect")
    .attr("x", key_rect_x)
    .attr("y", key_rect_y)
    .attr("width", key_width)
    .attr("height", height);
  d3.select("#key_el")
    .append("text")
    .attr("id", "key_text")
    .attr("x", key_rect_x + key_width / 2)
    .attr("y", key_rect_y + height / 2)
    .text(key)
    .style("opacity", 0)
    .style("font-size", height * 0.5);
  // addition text
  anim_header.select("#key_txt1")
    .append("tspan")
    .attr("id", "key_txt2")
    .attr("x", key_rect_x + key_width * 1.05)
    .text(" to spread out to columns")
  // fade in first sentence
  d3.select("#key_txt1")
    .transition()
    .delay(start_time)
    .duration(tran_time)
    .style("opacity", 1);
  d3.select("#key_rect")
    .transition()
    .delay(start_time)
    .duration(tran_time)
    .style("opacity", 1);
  d3.select("#key_text")
    .transition()
    .delay(start_time)
    .duration(tran_time)
    .style("opacity", 1);
  delay_time = delay_time + tran_time;

  // move key els (eg english maths) to first sentence
  keyel_rect_x = d3.select("#key_txt1").node().getComputedTextLength() + key_width * 1.2;
  adj_width = 0;
  adj_text_x = 0;
  keyel_nodes = d3.selectAll(".o_rows")
    .selectAll(`.o_cols:nth-child(${key_ind})`)
    .nodes();

  for (let i = 0; i < key_seq.length; i++) {
    cur_head_move = d3.select(keyel_nodes[key_seq[i]["start"]]);
    cur_move_rect = cur_head_move.select("rect").clone(true);
    cur_move_text = cur_head_move.select("text").clone(true);
    // insert them into the anim_head group
    insertnodeinto(cur_move_rect.node(), "#anim_header");
    insertnodeinto(cur_move_text.node(), "#anim_header");
    // move rect
    cur_move_rect
      .transition()
      .delay(delay_time)
      .duration(tran_time)
      .attr("x", keyel_rect_x + adj_width)
      .attr("y", key_rect_y);
    // move text
    cur_move_text
      .transition()
      .delay(delay_time)
      .duration(tran_time)
      .attr("x", keyel_rect_x + key_width / 2 + adj_width)
      .attr("y", key_rect_y + height / 2);
    // adjust width
    adj_width = adj_width + parseFloat(cur_move_rect.attr("width")) * 1.05;
  }
  delay_time = delay_time + tran_time;

  // adjust start_xy[y] for next line
  start_xy["y"] = start_xy["y"] + height * 1.2;
  // value text
  anim_header
    .append("text")
    .attr("id", "value_txt")
    .attr("x", start_xy["x"])
    .attr("y", start_xy["y"])
    .style("opacity", 0)
    .style("text-anchor", "start")
    .style("font-size", height * 0.6)
    .text("Then, put their corresponding ");
  // value rect
  value_rect_x = d3.select("#value_txt").node().getComputedTextLength() * 1.015 +
    start_xy["x"];
  value_rect_y = start_xy["y"] - height / 2;
  anim_header.append("g")
    .attr("id", "value_el")
    .append("rect")
    .style("opacity", 0)
    .attr("id", "value_rect")
    .attr("x", value_rect_x)
    .attr("y", value_rect_y)
    .attr("width", value_width)
    .attr("height", height);
  d3.select("#value_el")
    .append("text")
    .style("opacity", 0)
    .attr("id", "value_text")
    .attr("x", value_rect_x + value_width / 2)
    .attr("y", value_rect_y + height / 2)
    .text(value)
    .style("font-size", height * 0.5);
  // add additional text
  anim_header.select("#value_txt")
    .append("tspan")
    .attr("id", "key_txt2")
    .attr("x", value_rect_x + value_width * 1.05)
    .text(" values in these columns")
  // fade in all sentences
  d3.select("#value_txt")
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .style("opacity", 1);
  d3.select("#value_rect")
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .style("opacity", 1);
  d3.select("#value_text")
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .style("opacity", 1);
  delay_time = delay_time + tran_time;

  return d3.select("svg")
    .transition().delay(delay_time);
}

function spread_anim_pivot(tbl_mid_xy, pivot_name, pivot_rows, speed = 1, start_time = 0, msg = false) {
  let delay_time = start_time;
  let tran_time = 2000 / speed;
  let tran_time2 = 3000 / speed;
  let iso_time = 4000 / speed;
  let pause_time = 1500 / speed;
  let height = parseFloat(d3.select("rect").attr("height"));
  let store = new Array();

  iso_msgbox(tbl_mid_xy["x"], tbl_mid_xy["y"], height * 15, height,
    `Move across unique values from ${pivot_name}`, delay_time, iso_time, 0.5, pause_time);

  delay_time = delay_time + iso_time;

  // move unique pivot cols from otbl to rtbl
  // find the rect's xy so we know where to move it
  new_piv_nodes = d3.select(".r_tbl").selectAll(".piv_col")
    .selectAll("rect").nodes();
  new_piv_nodes.shift();
  new_piv_width = parseFloat(d3.select(new_piv_nodes[0])
    .attr("width"));
  // pulse it
  pivot_rows.forEach(function (d, i) {
    cur_el = d3.selectAll(`.o_rows:nth-child(${d + 1})`)
      .select(`.piv_col`).clone(true);
    cur_el.attr("class", "removed");
    // store.push(cur_el.node());


    db_pulse_rect(cur_el.select("rect").node(), "yellow", tran_time, delay_time);
    cur_x = parseFloat(d3.select(new_piv_nodes[i]).attr("x"));
    cur_y = parseFloat(d3.select(new_piv_nodes[i]).attr("y"));
    cur_el.select("rect")
      .transition()
      .delay(delay_time + tran_time)
      .duration(tran_time)
      .attr("x", cur_x)
      .attr("y", cur_y)
      .on("end", function () {
        d3.select(this)
          .remove()
      });
    cur_el.select("text")
      .transition()
      .delay(delay_time + tran_time)
      .duration(tran_time)
      .attr("x", cur_x + new_piv_width / 2)
      .attr("y", cur_y + height / 2)
      .on("end", function () {
        // make sure its in the r tbl
        insertnodeinto(d3.select(this).node(), ".r_tbl");
      });


  })
  delay_time = delay_time + 2 * tran_time;
  // console.log(store)
  // d3.select("svg")
  //   .transition()
  //   .delay(delay_time)
  //   .on("end", function(){
  //     console.log(store)
  //     d3.selectAll(store)
  //       .remove();
  //   })
  return d3.select("svg")
    .transition().delay(delay_time);
}

function spread_anim_move(tbl_mid_xy, chunk, row_seq, key_ind, new_key_ind, val_ind, speed = 1, start_time = 0, msg = false) {
  let delay_time = start_time;
  let tran_time = 2000 / speed;
  let tran_time2 = 3000 / speed;
  let iso_time = 4000 / speed;
  let pause_time = 1500 / speed;
  let height = parseFloat(d3.select("rect").attr("height"));
  let all_oval_col = d3.selectAll(chunk)
    .select(`.o_cols:nth-child(${val_ind})`).nodes();
  let all_r_rows = d3.selectAll(".r_rows").nodes();
  let cur_newval_rects = d3.selectAll(all_r_rows)
    .select(`.r_cols:nth-child(${new_key_ind})`)
    .selectAll("rect").nodes()

  // pulse
  row_seq.forEach(function (d, i) {
    // d3.select("svg")
    //   .transition()
    //   .delay(delay_time)
    //   .on("end", function() {

    //   })
    // pulse pivot
    db_pulse_rect(d3.select(chunk[i]).select(".piv_col").select("rect").node(),
      "yellow", tran_time, delay_time);
    // pulse key col
    db_pulse_rect(d3.select(chunk[i]).select(`.o_cols:nth-child(${key_ind})`).select("rect").node(),
      "yellow", tran_time, delay_time);
    // pulse the coresponding column in the new column
    db_pulse_rect(d3.select(".r_rows").select(`.r_cols:nth-child(${new_key_ind})`).select("rect").node(),
      "yellow", tran_time, delay_time);
    // pulse the corresponding pivot element in the new table
    db_pulse_rect(d3.select(all_r_rows[d]).select(`.r_cols:nth-child(1)`).select("rect").node(),
      "yellow", tran_time, delay_time);
    delay_time = delay_time + tran_time;

    // move the values from old to new
    cur_el = d3.select(chunk[i]).selectAll(`.o_cols:nth-child(${val_ind})`).clone(true);
    cur_target = d3.select(cur_newval_rects[d]);
    new_x = parseFloat(cur_target.attr("x"));
    new_y = parseFloat(cur_target.attr("y"));
    new_width = parseFloat(cur_target.attr("width"));
    // console.log(cur_newval_rects[d])
    cur_el.select("rect")
      .transition()
      .duration(tran_time)
      .delay(delay_time)
      .attr("x", new_x)
      .attr("y", new_y)
      .attr("width", new_width)
      .on("end", function () {
        d3.select(this)
          .remove();
      })
    cur_el.select("text")
      .transition()
      .duration(tran_time)
      .delay(delay_time)
      .attr("x", new_x + new_width / 2)
      .attr("y", new_y + height / 2)
      .attr("width", new_width)
      .on("end", function () {
        insertnodeinto(d3.select(this).node(), ".r_tbl");
      });
    delay_time = delay_time + tran_time;
  })


  return delay_time;
}

function spread_anim_fillna(na_pos, speed = 1, start_time = 0) {
  let delay_time = start_time;
  let tran_time = 3000 / speed;
  let height = parseFloat(d3.select("rect").attr("height"));

  na_pos.forEach(function(d, i) {
    ind_x = d[0];
    ind_y = d[1];

    cur_rect = d3.select(`.r_rows:nth-child(${ind_x + 1})`)
      .select(`.r_cols:nth-child(${ind_y})`)
      .select("rect");
    new_x = parseFloat(cur_rect.attr("x"));
    new_y = parseFloat(cur_rect.attr("y"));
    new_width = parseFloat(cur_rect.attr("width"));

    new_na = d3.select("svg")
      .append("text");
    new_na.text("NA")
      .style("font-size", height * 0.5)
      .style("opacity", 0)
      .attr("x", new_x + new_width / 2)
      .attr("y", new_y + height / 2);

    new_na.transition()
      .delay(delay_time)
      .duration(tran_time)
      .style("opacity", 1);

  })

  return delay_time;
}
