// remove comment \/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$
function clone_nodes() {
  d3.select(this).clone(false);
};
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
function a_intersect(a, b) {
  var t;
  if (b.length > a.length) t = b, b = a, a = t;
  return a.filter(function (e) {
    return b.indexOf(e) > -1;
  });
}
function a_intersect2(a, b) {
  var t;
  if (b.length > a.length) t = b, b = a, a = t;
  return a.filter(function (e) {
    return b.indexOf(e) > -1;
  }).filter(function (e, i, c) {
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
  for (var i = 0; i < level; i++) {
    sel = sel.select(function () {
      return this.parentNode;
    });
    sel.classed(s_class, true);
  }
}
function db_pulse_rect(nodes, col, tran_time = 1000, delay_time = 0, keep_highlighted = false) {
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
function link_rect_line(base, base_key_rect_xy, dest = -1, qm_align = "left", tran_time = 2000, delay_time = 0,
  msg, removeall = true, msg_pause = 2000) {
let rect_height = parseFloat(d3.select("rect").attr("height"));
  let rect_width = null;
  d3.select(".x_rows")
    .selectAll("rect")
    .each(function (d, i) {
      cur_width = d3.select(this).attr("width");
      if (i == 0) {
        rect_width = cur_width;
      } else {
        if (cur_width < rect_width) {
          rect_width = cur_width;
        }
      }
    });
  let cond = dest;
  let qm_tran_time = tran_time * 0.8;
  let qm_delay_time = qm_tran_time;
  let base_node = base;
  let dest_node = dest;
  let mid_cord = tbl_mid_cord("x", "y");
  let msg_trantime = tran_time / 2;
  db_pulse_rect(base_node, "yellow", tran_time, delay_time, true);
  if (cond != -1) {
    db_pulse_rect(dest_node, "yellow", tran_time, delay_time, true);
  }
  base = rect_mid_cord(base)[0];
  if (cond == -1) {
    dest = [tbl_mid_cord("x", "y")]

  } else {
    dest = rect_mid_cord(dest);
  }
  if (qm_align == "right") {
    qm_class = "qm";
  } else if (qm_align === "left") {
    qm_class = "qm2";
  }
  let link_line = new Array();
  dest.forEach(function (d, i) {
    link_line_i = d3.select("svg")
      .append("line")
      .attr("x1", base_key_rect_xy["x"])
      .attr("y1", base_key_rect_xy["y"])
      .attr("x2", base_key_rect_xy["x"])
      .attr("y2", base_key_rect_xy["y"]);
    link_line.push(link_line_i);
  })
  if (cond != -1) {
    link_line.forEach(function (d, i) {
      d.transition()
        .delay(delay_time)
        .duration(tran_time)
        .attr("x2", dest[i]["x"])
        .attr("y2", dest[i]["y"]);
    })
    delay_time = delay_time + tran_time;
  } else {
    link_line.forEach(function (d, i) {
      d.transition()
        .delay(delay_time)
        .duration(tran_time)
        .attr("x2", dest[i]["x"])
        .attr("y2", dest[i]["y"]);
    })
    delay_time = delay_time + tran_time;
    qm = d3.select("svg")
      .append("text")
      .attr("class", qm_class)
      .attr("x", dest[0]["x"])
      .attr("y", dest[0]["y"])
      .style("font-size", 0);
    qm.transition()
      .delay(delay_time)
      .duration(qm_tran_time)
      .text("?")
      .style("font-size", rect_height * 1.5)
    delay_time = delay_time + qm_tran_time;
  }
  if (msg["msg"] != undefined) {
    let msg_x = new Array();
    let msg_y = new Array();
    link_line.forEach(function (d, i) {
      msg_x.push((dest[0]["x"] + base_key_rect_xy["x"]) / 2);
      msg_y.push((dest[0]["y"] + base_key_rect_xy["y"]) / 2);
    });
    msg_x = arr_sum(msg_x) / msg_x.length;
    msg_y = arr_sum(msg_y) / msg_y.length;
    delay_time = msg_box(msg_x, msg_y, rect_width * 3, rect_height * 2, msg["msg"], delay_time, msg_trantime, msg_pause);
    delay_time = delay_time + tran_time / 2;
  }
  link_line.forEach(function (d, i) {
    d.transition()
      .delay(delay_time)
      .on("end", function () {
        d3.select(this)
          .remove();
        d3.selectAll("rect")
          .style("fill", null);
      });
  })
  if (cond == -1) {
    qm.transition()
      .delay(delay_time)
      .on("end", function () {
        d3.select(this)
          .remove();
      });
  }
  return delay_time;
}

function link_rect_line2(base, base_key_rect_xy, dest = -1, qm_align = "left", tran_time = 2000, delay_time = 0,
  msg, removeall = true) {
  if (msg["msg"] != undefined) {
    msg_trantime = tran_time * 0.15;
    msg_pausetime = tran_time * 0.35;
    tran_time = tran_time / 2;
  }
  if (dest == -1) {
    qm_tran_time = tran_time * 0.2;
    tran_time = tran_time * 0.8;
  }
  let rect_height = parseFloat(d3.select("rect").attr("height"));
  let rect_width = null;
  d3.select(".x_rows")
    .selectAll("rect")
    .each(function (d, i) {
      cur_width = d3.select(this).attr("width");
      if (i == 0) {
        rect_width = cur_width;
      } else {
        if (cur_width < rect_width) {
          rect_width = cur_width;
        }
      }
    });

  let cond = dest;
  let base_node = base;
  let dest_node = dest;
  let mid_cord = tbl_mid_cord("x", "y");
  db_pulse_rect(base_node, "yellow", tran_time, delay_time, true);
  if (cond != -1) {
    db_pulse_rect(dest_node, "yellow", tran_time, delay_time, true);
  }
  base = rect_mid_cord(base)[0];
  if (cond == -1) {
    dest = [tbl_mid_cord("x", "y")]
  } else {
    dest = rect_mid_cord(dest);
  }
  if (qm_align == "right") {
    qm_class = "qm";
  } else if (qm_align === "left") {
    qm_class = "qm2";
  }
  let link_line = new Array();
  dest.forEach(function (d, i) {
    link_line_i = d3.select("svg")
      .append("line")
      .attr("x1", base_key_rect_xy["x"])
      .attr("y1", base_key_rect_xy["y"])
      .attr("x2", base_key_rect_xy["x"])
      .attr("y2", base_key_rect_xy["y"]);
    link_line.push(link_line_i);
  })
  if (cond != -1) {
    link_line.forEach(function (d, i) {
      d.transition()
        .delay(delay_time)
        .duration(tran_time)
        .attr("x2", dest[i]["x"])
        .attr("y2", dest[i]["y"]);
    })
    delay_time = delay_time + tran_time;
  } else {
    link_line.forEach(function (d, i) {
      d.transition()
        .delay(delay_time)
        .duration(tran_time)
        .attr("x2", dest[i]["x"])
        .attr("y2", dest[i]["y"]);
    })
    delay_time = delay_time + tran_time;
    qm = d3.select("svg")
      .append("text")
      .attr("class", qm_class)
      .attr("x", dest[0]["x"])
      .attr("y", dest[0]["y"])
      .style("font-size", 0);
    qm.transition()
      .delay(delay_time)
      .duration(qm_tran_time)
      .text("?")
      .style("font-size", rect_height * 1.5)
    delay_time = delay_time + qm_tran_time;
  }
  if (msg["msg"] != undefined) {
    let msg_x = new Array();
    let msg_y = new Array();
    link_line.forEach(function (d, i) {
      msg_x.push((dest[0]["x"] + base_key_rect_xy["x"]) / 2);
      msg_y.push((dest[0]["y"] + base_key_rect_xy["y"]) / 2);
    });
    msg_x = arr_sum(msg_x) / msg_x.length;
    msg_y = arr_sum(msg_y) / msg_y.length;
    delay_time = msg_box(msg_x, msg_y, rect_width * 3, rect_height * 2, msg["msg"], delay_time, msg_trantime,
      msg_pausetime);
  }
  link_line.forEach(function (d, i) {
    d.transition()
      .delay(delay_time)
      .on("end", function () {
        d3.select(this)
          .remove();
        d3.selectAll("rect")
          .style("fill", null);
      });
  })
  if (cond == -1) {
    qm.transition()
      .delay(delay_time)
      .on("end", function () {
        d3.select(this)
          .remove();
      });
  }
  return delay_time;
}
function link_rectline_only(base, base_key_rect_xy, dest = -1, tran_time = 2000, delay_time = 0) {
  let rect_height = parseFloat(d3.select("rect").attr("height"));
  let cond = dest;
  let qm_tran_time = tran_time * 0.8;
  let return_delay = delay_time + tran_time;
  let base_node = base;
  let dest_node = dest;
  base = rect_mid_cord(base)[0];
  if (cond == -1) {
    dest = [tbl_mid_cord("x", "y")]
    return_delay = return_delay + qm_tran_time;
  } else {
    dest = rect_mid_cord(dest)
  }
  dest.forEach(function (d, i) {
    link_line = d3.select("svg")
      .append("line");
    link_line.attr("x1", base_key_rect_xy["x"])
      .attr("y1", base_key_rect_xy["y"])
      .attr("x2", base_key_rect_xy["x"])
      .attr("y2", base_key_rect_xy["y"]);
    link_line
      .transition()
      .duration(tran_time)
      .delay(delay_time)
      .attr("x2", d["x"])
      .attr("y2", d["y"])
      .on("end", function () {
        link_line = d3.select(this);
        d3.select("svg")
          .transition()
          .delay(1000)
          .on("end", function () {
            link_line.remove()
          })
      });
  })
  return return_delay;
}

function move_rect(to_sel, from_node, tran_time, delay_time) {
  parent_setclass(d3.select(from_node), "moved", 1);
  d3.select(from_node)
    .select("rect")
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
    .attr("width", to_sel.attr("width"))
    .on("end", function (d, i) {
      d3.select(this)
        .remove();
    });
}
function move_text(to_sel, from_node, tran_time, delay_time) {
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
  if (y === null) {
    y = d3.select(node)
      .select("rect")
      .attr("y")
  }
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
  parent_setclass(d3.select(node), "moved", 1);
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
  rnode = d3.select(node)
    .select("rect")
    .clone(true)
    .node();
  tnode = d3.select(node)
    .select("text")
    .clone(true)
    .node();
  if (ry === null) {
    ry = d3.select(node)
      .select("rect")
      .attr("y")
  }
  d3.select(rnode)
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
    });
  if (ty === null) {
    ty = d3.select(node)
      .select("text")
      .attr("y");
  }
  if (adj_ty !== null) {
    ty = ty + 0.5 * adj_ty;
  }
  d3.select(tnode)
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
    });
  return delay_time + tran_time;
}
function movexy_cell_wobj(node, xy, height, width, tran_time, delay_time,
  location = null, join_type = "left", msg = undefined, remove = false) {
  let xy_keys = Object.keys(xy);
  let return_delay = 0;
  if (node.length == undefined) {
    node = [node];
  }
  if (node[0] == undefined) {
    if (join_type === "left" || join_type === "complete") {
      xy[0]["x"].forEach(function (d, i) {
        na_rects(d, xy[0]["y"], width[i], height, `.x_rows:nth-child(${location[0]})`,
          tran_time, delay_time)
      });
    } else if (join_type === "inner") {
      d3.select(`.x_rows:nth-child(${location[0]})`)
        .classed("remove_row", true)
        .transition()
        .delay(delay_time)
        .duration(tran_time)
        .style("opacity", 0);
    }
    return_delay = return_delay + tran_time;
    return return_delay;
  }
  node.forEach(function (d, i) {
    cur_node = d3.select(node[i]).selectAll(".y_cols:not(.y_cols_key)").nodes();
    cur_node.forEach(function (d2, j) {
      movexy_cell(d3.select(d2).node(), xy[i]["x"][j], xy[i]["y"], xy[i]["x"][j],
        xy[i]["y"], height, width[j], tran_time, delay_time,
        `.x_rows:nth-child(${location[i]})`, msg, false)
    });
  })
  return_delay = return_delay + tran_time;
  return return_delay;
}
function tbl_mid_cord(c1, c2, xy = true) {
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
function get_newcol_xy(initial_prep, totbl_topright, fromtbl_nkey_wd, height) {
  totbl_topright[1] = totbl_topright[1] + height;
  let new_x = [totbl_topright[0]];
  fromtbl_nkey_wd.map((d, i) => {
    if (i > 0) {
      new_x.push(new_x[i - 1] + fromtbl_nkey_wd[i - 1]);
    }
  });
  let s_cnt = -1;
  let store_obj = new Object();
  Object.keys(initial_prep).forEach(function (d, i, k) {
    cur_data = initial_prep[d];
    if (i === 0) {
      cur_store = [{
        x: new_x,
        y: totbl_topright[1]
      }]
    } else {
      cur_store = new Array();
      for (var j = 0; j < cur_data.length; j++) {
        if (j > 0) {
          s_cnt++;
        }
        cur_store.push({
          x: new_x,
          y: totbl_topright[1] +
            height * (cur_data[j]["row"] + s_cnt)
        })
      }
    }
    store_obj[i + 1] = cur_store;
  });
  return store_obj;
}
function get_newcol_xyw_cn(to_tbl_id, from_tbl_id) {
  let new_width = new Array()
  let new_xy = tbl_tr_cord(to_tbl_id);
  let new_x = [new_xy[0]];
  let new_y = parseFloat(d3.select(`.${to_tbl_id}_tbl`)
    .select("rect").attr("y"));
  let nodes2move = d3.select(`.${from_tbl_id}_rows`)
    .selectAll(`.${from_tbl_id}_cols:not(.${from_tbl_id}_cols_key)`)
    .nodes();
  nodes2move.forEach(function (d, i) {
    cur_rect = d3.select(d).select("rect");
    new_width.push(parseFloat(cur_rect.attr("width")));
    if (i > 0) {
      new_x.push(new_x[i - 1] +
        parseFloat(d3.select(nodes2move[i - 1])
          .select("rect")
          .attr("width")))
    }
  })
  return {
    x: new_x,
    y: new_y,
    width: new_width
  };
}
function tbl_tr_cord(c) {
  tr_rect = d3.select(`.${c}_tbl`)
    .select(`.${c}_cols_last > rect`);
  x = parseFloat(tr_rect.attr("x"));
  y = parseFloat(tr_rect.attr("y"));
  wd = parseFloat(tr_rect.attr("width"));
  return [x + wd, y];
}

function tbl_bl_cord(c) {
  last_row = d3.select(".x_tbl")
    .select(".x_rows:last-of-type");
  first_rect = last_row.select("rect");
  return {
    x: parseFloat(first_rect.attr("x")),
    y: parseFloat(first_rect.attr("y")) + parseFloat(first_rect.attr("height"))
  }
}

function msg_box(x, y, width = null, height = null, msg, start_time = 0, tran_time = 1000, pause_time = 1000, center = true) {
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
  if (center === true) {
    x = x - width / 2;
    y = y - height / 2;
  }
  let txt_x = x + width / 2;
  let txt_y = y + height / 2;
  let txt_fontsize = d3.select("text")
    .style("font-size");
  msgbox = d3.select("svg")
    .append("g")
    .attr("class", "msgbox");
  if (msg == "gettimeonly") {
    msgbox
      .style("opacity", 0)
  }
  msgbox.append("rect")
    .transition()
    .delay(start_time)
    .duration(tran_time)
    .attr("x", x)
    .attr("y", y)
    .attr("width", width)
    .attr("height", height);
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

function na_rects(x, y, width, height, location = null, tran_time = 1000, delay_time = 0) {
  let svg = d3.select("svg");
  svg
    .append("rect")
    .attr("class", "na_rects")
    .attr("x", x)
    .attr("y", y)
    .attr("width", 0)
    .attr("height", 0)
    .transition()
    .duration(tran_time)
    .delay(delay_time)
    .attr("width", width)
    .attr("height", height)
    .on("end", function () {
      base = this;
      d3.select(location)
        .insert(function () {
          return base;
        })
    });
  svg
    .append("text")
    .attr("class", "na_rects")
    .attr("x", x + 0.5 * width)
    .attr("y", y + 0.5 * height)
    .text("NA")
    .style("font-size", 0)
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .style("font-size", height * 0.55)
    .on("end", function () {
      base = this;
      d3.select(location)
        .insert(function () {
          return base;
        })
    });;
}

function keycol_anim(to_tbl, from_tbl, speed = 1, start_time = 0) {
  let keypath_tran_time = 1500 / speed;
  let key_opacity_tran_time = 1000 / speed;
  let rectpulse_tran_time = 1500 / speed;
  let join_tran_time = 2000 / speed;
  let delay_time = start_time;
  let key_name = d3.select(`.${to_tbl}_cols_key`)
    .select("text").text();
  let to_keycol_node = d3.select(`.${to_tbl}_cols_key`)
    .node();
  let from_keycol_node = d3.select(`.${from_tbl}_cols_key`)
    .node();
  let to_keycol_node2 = d3.select(`.${to_tbl}_cols_key`)
    .nodes();
  let from_keycol_node2 = d3.select(`.${from_tbl}_cols_key`)
    .nodes();
  let to_keyrect_sel = d3.select(to_keycol_node)
    .select("rect");
  let from_keyrect_sel = d3.select(from_keycol_node)
    .select("rect");
  let to_keytext_sel = d3.select(to_keycol_node)
    .select("text");
  let to_nkeycol_nodes = d3.select(`.${to_tbl}_rows`)
    .selectAll(`.${to_tbl}_cols:not(.${to_tbl}_cols_key)`)
    .nodes();
  let from_nkeycol_nodes = d3.select(`.${from_tbl}_rows`)
    .selectAll(`.${from_tbl}_cols:not(.${from_tbl}_cols_key)`)
    .nodes();
  let to_nkeycol_nodes2 =
    d3.selectAll(`.${to_tbl}_cols:not(.${to_tbl}_cols_key)`)
    .nodes();
  let from_nkeycol_nodes2 =
    d3.selectAll(`.${from_tbl}_cols:not(.${from_tbl}_cols_key)`)
    .nodes();
  let height = parseFloat(to_keyrect_sel.attr("height"));
  let keylink_nodes = new Array();
  to_keyrect_sel.nodes().forEach(function (d, i) {
    one = [
      parseFloat(to_keyrect_sel.attr("x")) +
      parseFloat(to_keyrect_sel.attr("width")) / 2,
      parseFloat(to_keyrect_sel.attr("y"))
    ];
    two = [one[0], height * 0.6];
    three = [
      parseFloat(from_keyrect_sel.attr("x")) +
      parseFloat(from_keyrect_sel.attr("width")) / 2,
      two[1]
    ];
    four = [three[0], one[1]];
    draw_path = `M ${one} ${two} ${three} ${four}`;
    path_sel = d3.select("svg")
      .append("path")
      .attr("class", "key_col_link")
      .attr("d", draw_path)
      .attr("fill", "none")
      .attr('fill-opacity', 0);

    keylink_nodes.push(path_sel.node())
  })
  d3.selectAll(to_nkeycol_nodes2)
    .transition()
    .delay(delay_time)
    .duration(key_opacity_tran_time)
    .style("opacity", 0.5);
  d3.selectAll(from_nkeycol_nodes2)
    .transition()
    .delay(delay_time)
    .duration(key_opacity_tran_time)
    .style("opacity", 0.5);
  delay_time = delay_time + key_opacity_tran_time;
  keylink_nodes.forEach(function (d, i) {
    length = d.getTotalLength();
    d3.select(d)
      .attr("stroke-dasharray", length + " " + length)
      .attr("stroke-dashoffset", length)
      .transition()
      .delay(delay_time)
      .duration(keypath_tran_time)
      .attr("stroke-dashoffset", 0)
  });
  d3.select("svg")
    .append("text")
    .attr("id", "joinby_text")
    .attr("x", (one[0] + four[0]) / 2)
    .attr("y", one[1])
    .style("opacity", 0)
    .style("font-size", d3.select("text").style("font-size"))
    .style("alignment-baseline", "hanging")
    .text(`Joining by ${key_name}`)
    .transition()
    .duration(keypath_tran_time)
    .delay(delay_time)
    .style("opacity", 1)
    .on("end", function () {
      d3.select(this)
        .remove();
    })
  delay_time = delay_time + keypath_tran_time;
  db_pulse_rect(from_keyrect_sel.nodes(), "yellow", rectpulse_tran_time, delay_time)
  db_pulse_rect(to_keyrect_sel.nodes(), "yellow", rectpulse_tran_time, delay_time)
  delay_time = delay_time + rectpulse_tran_time;
  let new_xyd = get_newcol_xyw_cn("x", "y")
  from_nkeycol_nodes.forEach(function (d, i) {
    movexy_cell(d, new_xyd["x"][i], new_xyd["y"], new_xyd["x"][i],
      new_xyd["y"], height, new_xyd["width"][i], join_tran_time, delay_time,
      ".x_rows", false)
  })
  delay_time = delay_time + join_tran_time;
  d3.selectAll(to_nkeycol_nodes2)
    .transition()
    .delay(delay_time)
    .duration(key_opacity_tran_time)
    .style("opacity", 1);
  d3.selectAll(from_nkeycol_nodes2)
    .transition()
    .delay(delay_time)
    .duration(key_opacity_tran_time)
    .style("opacity", 1);
  delay_time = delay_time + key_opacity_tran_time;
  return d3.select("svg")
    .transition()
    .delay(delay_time);
}
function shift_row_down(tbl_id, tbl_sel, row2shift, shiftdown_times, height,
  tran_time, delay_time) {
  tbl_sel.selectAll(`.${tbl_id}_rows:nth-child(n+${row2shift + 1}`)
    .each(function (d, i) {
      cur_rect_y = d3.select(this)
        .selectAll("rect")
        .attr("y");
      cur_text_y = d3.select(this)
        .selectAll("text")
        .attr("y");
      d3.select(this)
        .selectAll("rect")
        .transition()
        .duration(tran_time)
        .delay(delay_time)
        .attr("y", parseFloat(cur_rect_y) + shiftdown_times * height);
      d3.select(this)
        .selectAll("text")
        .transition()
        .duration(tran_time)
        .delay(delay_time)
        .attr("y", parseFloat(cur_text_y) + shiftdown_times * height);
    });
  tbl_sel.select(`.${tbl_id}_rows:nth-child(${row2shift}`)
    .transition()
    .delay(delay_time)
    .on("end", function () {
      for (var j = shiftdown_times; j >= 1; j--) {
        cur_row = d3.select(this).clone(true);
        cur_row.style("opacity", 0);
        cur_row.transition()
          .duration(tran_time / 2)
          .style("opacity", 1);
        cur_rect_y = parseFloat(cur_row.select("rect").attr("y"));
        cur_text_y = parseFloat(cur_row.select("text").attr("y"));
        cur_col = cur_row.selectAll(`.${tbl_id}_cols`);
        cur_col.selectAll("rect")
          .transition()
          .duration(tran_time * 0.7)
          .attr("y", cur_rect_y + height * j);
        cur_col.selectAll("text")
          .transition()
          .duration(tran_time * 0.7)
          .attr("y", cur_text_y + height * j);
      }
    })
  return delay_time + tran_time;
}

function iso_tbl(join_type = "left", height, speed = 1, start_time = 0) {
  let tran_time = 1500 / speed;
  let delay_time = start_time;
  let to_tbl = "x";
  let from_tbl = "y";
  if (join_type === "right") {
    let to_tbl = "y";
    let from_tbl = "x";
  }
  let svg_wh = {
    height: parseFloat(d3.select("svg").attr("height")),
    width: parseFloat(d3.select("svg").attr("width"))
  }
  let to_tbl_tl = {
    x: parseFloat(d3.select(`.${to_tbl}_cols > rect`).attr("x")),
    y: parseFloat(d3.select(`.${to_tbl}_cols > rect`).attr("y"))
  }
  let to_tbl_width = 0;
  d3.select(`.${to_tbl}_rows`).selectAll("rect").nodes()
    .forEach(function (d, i) {
      to_tbl_width += parseFloat(d3.select(d).attr("width"));
    });
  let to_tbl_height = height * parseInt(d3.selectAll(".x_rows").nodes().length);
  d3.selectAll(`.${to_tbl}_rows:not(.remove_row)`).nodes().length;
  let translate_xy = {
    x: svg_wh["width"] / 2 - to_tbl_width / 2 - to_tbl_tl["x"],
    y: svg_wh["height"] / 2 - to_tbl_height / 2 - to_tbl_tl["y"]
  };
  d3.selectAll(`.${from_tbl}_tbl, path, .remove_row`)
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .style("opacity", 0)
    .on("end", function () {
      d3.select(this)
        .remove();
    });
  delay_time = delay_time + tran_time;
  d3.select(`.${to_tbl}_tbl`)
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .attr("transform", `translate(${translate_xy["x"]}, ${translate_xy["y"]})`);
  d3.selectAll(`.${to_tbl}_rows:not(.remove_row)`).nodes()
    .forEach(function (d, i) {
      d3.select(d)
        .selectAll("rect")
        .transition()
        .delay(delay_time)
        .duration(tran_time)
        .attr("y", to_tbl_tl["y"] + height * i);
      d3.select(d)
        .selectAll("text")
        .transition()
        .delay(delay_time)
        .duration(tran_time)
        .attr("y", to_tbl_tl["y"] + height * i + height / 2);
    })
  d3.select(`.${to_tbl}_rows`)
    .selectAll("text")
    .transition()
    .delay(delay_time)
    .duration(tran_time)
    .style("font-weight", "bold");
  delay_time = delay_time + tran_time;
  return d3.select("svg")
    .transition().delay(delay_time);
}
function draw_table(input, x_start, y_start, x_cord, width, height, name, key_col) {
  let y_cord = 0 - height;
  let tbl_name = `${name}_tbl`;
  let row_name = `${name}_rows`
  let col_name = `${name}_cols`
  let key_name = d3.keys(input);
  let new_x_cord = x_cord.map((d, i) => d + x_start);
  let new_y_cord = Array();
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
  var key_rect = d3.selectAll(`.${col_name}:nth-of-type(${key_col})`).nodes();
  d3.selectAll(key_rect)
    .classed(`${col_name}_key`, true)
    .classed("key_col", true);
  var last_rect = d3.selectAll(`.${col_name}:last-of-type`).nodes();
  d3.selectAll(last_rect)
    .classed(`${col_name}_last`, true)
    .classed("last_col", true);
  d3.selectAll(`.${row_name}`).each(function (d, i) {
    input_i = input[i];
    input_i_key = d3.keys(input_i);
    d3.select(this).selectAll(`.${col_name}`).each(function (d, j) {
      d3.select(this)
        .append("text")
        .text(input_i[input_i_key[j]])
        .attr("x", new_x_cord[j] + width[j] * 0.5)
        .attr("y", new_y_cord[i] + height * 0.5)
        .style("font-size", height * 0.5);
    })
  });
  d3.select(`.${row_name}`).selectAll("text").style("font-size", height * 0.5);
  return ({
    x: new_x_cord,
    y: new_y_cord
  });
};
function join_anim(data, speed = 1, join_type = "left", gray_out = true) {
  if (join_type == "left" || join_type == "complete") {
    return_delay = join_anim_left(data, speed, join_type = "left", gray_out);
  } else if (join_type = "inner") {
    return_delay = join_anim_inner(data, speed, join_type = "inner", gray_out);
  }
  return d3.select("svg")
    .transition().delay(return_delay);
}
function join_anim_left(data, speed = 1, join_type = "inner", gray_out = true) {
  let og_xtbl = d3.select(".x_tbl");
  let left_kcol_node = d3.select(".x_tbl")
    .selectAll(".x_cols_key").nodes();
  let right_kcol_node = d3.select(".y_tbl")
    .selectAll(".y_cols_key").nodes();
  let left_row_nodes = d3.selectAll(".x_rows").nodes();
  let right_row_nodes = d3.selectAll(".y_rows").nodes();
  let xy_tbl_cord = tbl_mid_cord("x", "y");
  let height = parseFloat(d3.select("rect").attr("height"));
  let xtbl_topright = tbl_tr_cord("x");
  let ytbl_nkey_wd = nkeycol_width("y");
  let new_xy = get_newcol_xy(data, xtbl_topright, ytbl_nkey_wd, height);
  let shift_cnt = 1;
  let shift_adjy = 0;
  let line_tran_time = 1200 / speed;
  let line_tran_time2 = 2400 / speed;
  let shiftdown_time = 1500 / speed;
  let join_tran_time = 1500 / speed;
  let na_action_time = 1000 / speed;
  let gray_time = 200 / speed;
  let delay_time = 0;
  let r_link_rect = {};
  d3.keys(data).forEach(function (d, i) {
    let cur_r_link_rect = new Array();
    if (data[d].length > 1) {
      data[d].forEach(function (d2, i2) {
        cur_r_link_rect.push(d3.select(right_kcol_node[d2["dest"]]).select("rect").node());
        r_link_rect[i] = cur_r_link_rect;
      })
    } else {
      if (data[d][0]["dest"] == -1) {
        cur_r_link_rect = -1;
      } else {
        cur_r_link_rect = d3.select(right_kcol_node[data[d][0]["dest"]])
          .select("rect").node();
      }
    }
    r_link_rect[i] = cur_r_link_rect;
  })
  d3.keys(data).forEach(function (d, i) {
    d3.select("svg")
      .transition()
      .delay(delay_time)
      .on("end", function () {
        msg = {
          msg: data[d][0].msg
        }
        ind = data[d][0]["row"];
        cur_left_rect = d3.select(left_kcol_node[ind])
          .select("rect").node();
        cur_left_rect_xy = rect_mid_cord(cur_left_rect)[0];
        cur_left_rect_xy["y"] = cur_left_rect_xy["y"];
        if (msg["msg"] != undefined) {
          cur_linetime = line_tran_time2;
        } else {
          cur_linetime = line_tran_time;
        }
        return_delay = link_rect_line2(cur_left_rect, cur_left_rect_xy, r_link_rect[i], "right",
          cur_linetime, 0, msg, removeall = true)
        data[d].forEach(function (d2, i2) {
          cur_rows2move = d3.select(right_row_nodes[d2["dest"]]).selectAll(".y_cols:not(.y_cols_key)").nodes();
          cur_rows2move.forEach(function (d33, i3) {
            cur_rectwidth = d3.select(d33).select("rect").attr("width");
            movexy_cell(cur_rows2move[i3], new_xy[1][0]["x"][i3], new_xy[1][0]["y"] + shift_adjy * height, new_xy[1][0]["x"][i3],
              new_xy[1][0]["y"] + shift_adjy * height, height, cur_rectwidth, join_tran_time, return_delay,
              `.x_rows:nth-child(${data[d][i2]["row"] + shift_cnt})`, {
                msg: undefined
              }, false);
          })
          shift_adjy = shift_adjy + 1
        })
        if (data[d].length > 1) {
          shift_row_down("x", og_xtbl, data[d][0]["row"] + shift_cnt, data[d].length - 1, height, shiftdown_time, return_delay);
          shift_cnt = shift_cnt + data[d].length - 1;
        }
      })
    if (data[d][0].msg != undefined) {
      delay_time = delay_time + line_tran_time2 + join_tran_time + 200 / speed;
    } else {
      delay_time = delay_time + line_tran_time + join_tran_time + 200 / speed;
    }
    if (data[d][0]["dest"] == -1) {
      d3.select("svg")
        .transition()
        .delay(delay_time)
        .on("end", function () {
          new_xy[d][0]["x"].forEach(function (d2, i2) {
            na_rects(d2, new_xy[d][0]["y"], ytbl_nkey_wd[i2], height,
              `.x_rows:nth-child(${data[d][0]["row"] + shift_cnt})`, na_action_time, 0);
          })
        })
      delay_time = delay_time + na_action_time;
    } else {
      data[d].forEach(function (d2, i2) {
        if (d2["dest"] != -1) {
          d3.select(right_row_nodes[d2["dest"]])
            .transition()
            .delay(delay_time)
            .duration(gray_time)
            .style("opacity", 0.3);
        }
      })
      delay_time = delay_time + gray_time;
    }
  })
  return delay_time;
}
function comjoin_final(data, speed = 1, start_time = 0) {
  let row2move = data.row2move;
  let col_ind = data.col_ind;
  if (row2move.length < 0) {
    return 0;
  }
  let tran_time = 1500 / speed;
  let lineqm_time = tran_time / 2;
  let na_time = (tran_time / 1.5) / speed;
  let delay_time = start_time;
  let num_xrows = d3.selectAll(".x_rows").nodes().length;
  let xtbl_bl = tbl_bl_cord("x");
  let xtbl_tr = tbl_tr_cord("x");
  let height = parseFloat(d3.select("rect").attr("height"));
  let last_xrow_rects = d3.select(".x_rows:last-of-type")
    .selectAll("rect")
    .nodes();
  let og_xcols = d3.select(".x_rows")
    .selectAll(".x_cols")
    .nodes();
  let newcols_ind = og_xcols.length + 1;
  let xcol_key_ind = d3.select(".x_rows")
  let new_x = new Array();
  let new_width = new Array();
  let msg_tran_time = 1500 / speed;
  let msg_pause_time = 1500 / speed;
  col_ind.forEach(function (d, i) {
    new_x.push(parseFloat(d3.select(last_xrow_rects[d - 1]).attr("x")));
    new_width.push(parseFloat(d3.select(last_xrow_rects[d - 1]).attr("width")));
  })
  let new_y = new Array();
  row2move.forEach(function (d, i) {
    if (i === 0) {
      new_y.push(xtbl_bl["y"]);
    } else {
      new_y.push(new_y[i - 1] + height);
    }
  });
  y_nkey_cols = d3.select(".y_rows")
    .selectAll(".y_cols:not(.y_cols_key)")
    .nodes();
  if (y_nkey_cols.length > 0) {
    na_width = new Array();
    na_x = new Array();
    y_nkey_cols.forEach(function (d, i) {
      na_width.push(parseFloat(d3.select(d).select("rect").attr("width")));
      if (i === 0) {
        na_x.push(xtbl_tr[0]);
      } else {
        na_x.push(na_x[i - 1] + na_width[i - 1]);
      }
    });
  }
  let rows2move = new Array();
  row2move.forEach(function (d, i) {
    cur_sel = d3.select(".y_tbl").select(`.y_rows:nth-child(${d + 1})`)
    rows2move.push(cur_sel.node());
    cur_rect = cur_sel.select(".y_cols_key").select("rect");
    new_time = link_rect_line(cur_rect.node(), rect_mid_cord(cur_rect.node())[0], -1, "left", tran_time, delay_time, false);
    d3.select(".x_tbl")
      .append("g")
      .attr("class", "x_rows");
  });
  delay_time = delay_time + new_time;
  d3.selectAll(".qm2")
    .transition()
    .delay(delay_time)
    .duration(lineqm_time)
    .style("font-size", 0)
    .on("end", function () {
      d3.select(this)
        .remove();
    });
  d3.selectAll("line")
    .transition()
    .delay(delay_time)
    .duration(lineqm_time)
    .style("opacity", 0)
    .on("start", function () {
      msg_xy = tbl_mid_cord("x", "y");
      new_time = msg_box(parseFloat(msg_xy["x"]), parseFloat(msg_xy["y"]), null, null,
        "Move across unused rows", 0, msg_tran_time, msg_pause_time, true);
    })
    .on("end", function () {
      d3.select(this)
        .remove();
      d3.select(".y_tbl")
        .selectAll("rect")
        .style("fill", null);
    });
  delay_time = delay_time + lineqm_time + new_time;
  num_xrows2 = num_xrows;
  d3.selectAll("svg")
    .transition()
    .delay(delay_time)
    .on("end", function () {
      rows2move.forEach(function (d, i) {
        num_xrows2++;
        inside_cols = d3.select(d).selectAll(".y_cols").nodes();
        inside_cols.forEach(function (d2, i2) {
          movexy_cell(d2, new_x[i2], new_y[i], new_x[i2], new_y[i], height, new_width[i2], tran_time, 0,
            `.x_rows:nth-child(${num_xrows2})`, false)
        })
      });
    })
  delay_time = delay_time + tran_time;
  if (last_xrow_rects.length > col_ind.length) {
    let x_nkey_last_rects = new Array();
    let seq_n = Array.from(Array(last_xrow_rects.length), (x, index) => index + 1);
    a_outersect(seq_n, col_ind).forEach(function (d, i) {
      x_nkey_last_rects.push(last_xrow_rects[d - 1]);
    });
    let na_x = [];
    let na_y = new_y;
    let na_width = [];
    let naregion_height = row2move.length * height;
    x_nkey_last_rects.forEach(function (d, i) {
      na_x.push(parseFloat(d3.select(d).attr("x")));
      na_width.push(parseFloat(d3.select(d).attr("width")));
    })
    x_nkey_last_rects.forEach(function (d, i) {
      na_region = d3.select("svg")
        .append("rect");
      na_region
        .attr("x", na_x[i])
        .attr("y", na_y[0])
        .attr("width", na_width[i])
        .attr("height", naregion_height)
        .attr("class", "na_region")
        .style("opacity", 0)
        .style("fill", "red")
        .transition()
        .delay(delay_time)
        .duration(tran_time)
        .style("opacity", 1);
    });
    delay_time = delay_time + tran_time;
    let na_regions = d3.selectAll(".na_region")
      .nodes();
    na_regions.forEach(function (d, i) {
      cur_mid = rect_mid_cord(d)[0];
      d3.select("svg")
        .append("text")
        .text("?")
        .attr("x", cur_mid["x"])
        .attr("y", cur_mid["y"])
        .attr("class", "na_region_txt")
        .style("font-size", 0)
        .transition()
        .delay(delay_time)
        .duration(na_time)
        .style("font-size", parseFloat(d3.select(d).attr("height")) / 2)
        .on("end", function () {
          db_pulse_rect(d, "white", na_time, 2, 0);
          d3.select(d)
            .transition()
            .delay(na_time / 2)
            .duration(na_time / 2)
            .style("opacity", 0)
            .on("end", function () {
              d3.select(this).remove();
            });
          d3.selectAll(".na_region_txt")
            .transition()
            .delay(na_time / 2)
            .duration(na_time / 2)
            .style("opacity", 0)
            .on("end", function () {
              d3.select(this).remove();
            });
        });
    });
    delay_time = delay_time + 2 * na_time;
    let num_xrows2 = num_xrows;
    x_nkey_last_rects.forEach(function (d, i) {
      row2move.forEach(function (d2, i2) {
        na_rects(na_x[i], new_y[i2], na_width[i], height, `.x_rows:nth-child(${num_xrows + 1})`,
          na_time, delay_time);
        num_xrows++;
      });
      num_xrows = num_xrows2;
    });
    delay_time = delay_time + na_time * 2;
  }
  d3.selectAll("line")
    .transition()
    .delay(delay_time)
    .on("end", function () {
      d3.select(this)
        .remove();
      d3.selectAll(".qm2")
        .style("opacity", 0);
    });
  return d3.select("svg")
    .transition().delay(delay_time);
}
function join_anim_inner(data, speed = 1, join_type = "inner", gray_out = true) {
  let og_xtbl = d3.select(".x_tbl");
  let left_kcol_node = d3.select(".x_tbl")
    .selectAll(".x_cols_key").nodes();
  let right_kcol_node = d3.select(".y_tbl")
    .selectAll(".y_cols_key").nodes();
  let left_row_nodes = d3.selectAll(".x_rows").nodes();
  let right_row_nodes = d3.selectAll(".y_rows").nodes();
  let xy_tbl_cord = tbl_mid_cord("x", "y");
  let height = parseFloat(d3.select("rect").attr("height"));
  let xtbl_topright = tbl_tr_cord("x");
  let ytbl_nkey_wd = nkeycol_width("y");
  let new_xy = get_newcol_xy(data, xtbl_topright, ytbl_nkey_wd, height);
  let shift_cnt = 1;
  let shift_adjy = 0;
  let line_tran_time = 1200 / speed;
  let line_tran_time2 = 2400 / speed;
  let shiftdown_time = 1500 / speed;
  let join_tran_time = 1500 / speed;
  let na_action_time = 500 / speed;
  let gray_time = 200 / speed;
  let delay_time = 0;
  let temp = 0;
  let r_link_rect = {};
  d3.keys(data).forEach(function (d, i) {
    let cur_r_link_rect = new Array();
    if (data[d].length > 1) {
      data[d].forEach(function (d2, i2) {
        cur_r_link_rect.push(d3.select(right_kcol_node[d2["dest"]]).select("rect").node());
        r_link_rect[i] = cur_r_link_rect;
      })
    } else {
      if (data[d][0]["dest"] == -1) {
        cur_r_link_rect = -1;
      } else {
        cur_r_link_rect = d3.select(right_kcol_node[data[d][0]["dest"]])
          .select("rect").node();
      }
    }
    r_link_rect[i] = cur_r_link_rect;
  })
  d3.keys(data).forEach(function (d, i) {
    d3.select("svg")
      .transition()
      .delay(delay_time)
      .on("end", function () {
        msg = {
          msg: data[d][0].msg
        }
        ind = data[d][0]["row"];
        cur_left_rect = d3.select(left_kcol_node[ind])
          .select("rect").node();
        cur_left_rect_xy = rect_mid_cord(cur_left_rect)[0];

        cur_left_rect_xy["y"] = cur_left_rect_xy["y"];
        if (msg["msg"] != undefined) {
          cur_linetime = line_tran_time2;
        } else {
          cur_linetime = line_tran_time;
        }
        return_delay = link_rect_line2(cur_left_rect, cur_left_rect_xy, r_link_rect[i], "right",
          cur_linetime, 0, msg, removeall = true)
        data[d].forEach(function (d2, i2) {
          cur_rows2move = d3.select(right_row_nodes[d2["dest"]]).selectAll(".y_cols:not(.y_cols_key)").nodes();
          cur_rows2move.forEach(function (d33, i3) {
            cur_rectwidth = d3.select(d33).select("rect").attr("width");
            movexy_cell(cur_rows2move[i3], new_xy[1][0]["x"][i3], new_xy[1][0]["y"] + shift_adjy * height, new_xy[1][0]["x"][i3],
              new_xy[1][0]["y"] + shift_adjy * height, height, cur_rectwidth, join_tran_time, return_delay,
              `.x_rows:nth-child(${data[d][i2]["row"] + shift_cnt})`, {
                msg: undefined
              }, false);
          })
          shift_adjy = shift_adjy + 1
        })
        if (data[d].length > 1) {
          shift_row_down("x", og_xtbl, data[d][0]["row"] + shift_cnt, data[d].length - 1, height, shiftdown_time, return_delay);
          shift_cnt = shift_cnt + data[d].length - 1;
        }
      })
    if (data[d][0].msg != undefined) {
      delay_time = delay_time + line_tran_time2 + join_tran_time + 200 / speed;
    } else {
      delay_time = delay_time + line_tran_time + join_tran_time + 200 / speed;
    }
    if (data[d][0]["dest"] == -1) {
      d3.select(`.x_rows:nth-child(${data[d][0]["row"] + shift_cnt })`)
        .classed("remove_row", true)
        .transition()
        .delay(delay_time)
        .duration(na_action_time)
        .style("opacity", 0);
      delay_time = delay_time + na_action_time;
    } else {
      data[d].forEach(function (d2, i2) {
        if (d2["dest"] != -1) {
          d3.select(right_row_nodes[d2["dest"]])
            .transition()
            .delay(delay_time)
            .duration(gray_time)
            .style("opacity", 0.3);
        }
      })
      delay_time = delay_time + gray_time;
    }
  })
  return delay_time;
}

function join_finalcheck(data) {
  let all_xrows = d3.selectAll(".x_rows").nodes();
  let cnt = 1;
  let bad_xrows = new Array();
  d3.keys(data).forEach(function (d, i) {
    if (data[d].length > 1) {
      bad_xrows.push(cnt);
    }
    cnt += data[d].length;
  })
  let num_ynkey_col = d3.select(".y_rows")
    .selectAll(".y_cols:not(.y_cols_key)")
    .nodes().length;
  d3.select("svg")
    .transition()
    .delay(250)
    .on("end", function () {
      bad_xrows.forEach(function (d, i) {
        cur_badrect = d3.selectAll(`.x_rows:nth-child(${d + 1}) > rect`).nodes();
        cur_badtext = d3.selectAll(`.x_rows:nth-child(${d + 1}) > text`).nodes();
        iterate_times = cur_badrect.length / num_ynkey_col - 1;
        cur_badrect = cur_badrect.slice(num_ynkey_col, cur_badrect.length);
        cur_badtext = cur_badtext.slice(num_ynkey_col, cur_badtext.length);
        for (let j = 1; j <= iterate_times; j++) {
          for (let k = 0; k < num_ynkey_col; k++) {
            d3.select(`.x_rows:nth-child(${d + 1 + j})`)
              .insert(function () {
                return cur_badrect[0];
              })
            d3.select(`.x_rows:nth-child(${d + 1 + j})`)
              .insert(function () {
                return cur_badtext[0];
              })
            cur_badrect.shift();
            cur_badtext.shift();
          }
        }
      })
    })
  return d3.select("svg").transition()
    .delay(500);
}
