function join_anim_left(data, speed = 1, join_type = "left", gray_out = true) {
  // original data
  let og_xtbl = d3.select(".x_tbl");
  let left_kcol_node = d3.select(".x_tbl")
    .selectAll(".x_cols_key").nodes();
  let right_kcol_node = d3.select(".y_tbl")
    .selectAll(".y_cols_key").nodes();
  let right_row_nodes = d3.selectAll(".y_rows").nodes();
  let xy_tbl_cord = tbl_mid_cord("x", "y");

  let height = parseFloat(d3.select("rect").attr("height"));
  let xtbl_topright = tbl_tr_cord("x");
  let ytbl_nkey_wd = nkeycol_width("y");
  let new_xy = get_newcol_xy(data, xtbl_topright, ytbl_nkey_wd, height);

  // shiftdown count
  let shift_cnt = 0;
  // shift_adjy is to keep count how many times rows has been shifted
  let shift_adjy = 0;

  let line_tran_time = 1200 / speed;
  let shiftdown_time = 1500 / speed;
  let join_tran_time = 1500 / speed;
  let gray_time = 200 / speed;
  let delay_time = 0;

  Object.keys(data).forEach(function (d, i) {
    // dest_key_rect array to store the node if there is more than 1
    let dest_key_rect = new Array();
    // row nodes that needs to be joined
    let join_row_nodes = new Array();
    // xrow's selection text for the new joined on nodes to insert into
    let join_row_selnum = new Array();
    // need to prepare since there are some rows may be shifted
    // it will be difficult getting them during animation
    let base_key_rect_xy = new Array();
    // msg for output
    let msg = {
      msg: data[d][0].msg,
      when: data[d][0].when
    };

    // loop through the data, some object[i] may contain multiple arrays
    for (var j = 0; j < data[d].length; j++) {
      // rect to flash on the to table
      base_key_rect = d3.select(left_kcol_node[data[d][j]["row"]])
        .select("rect").node();
      // rects to flash on the from table
      if (data[d][j]["dest"] != -1) {
        // give dest_key_rect the rect node if there is dest
        // this is an array to handle if theres more than 1 rect
        dest_key_rect.push(d3.select(right_kcol_node[data[d][j]["dest"]])
          .select("rect").node());
      } else {
        // if there is no dest then it is just -1 ("dest")
        dest_key_rect = data[d][j]["dest"];
        // join_row_selnum.push(null);
      }
      // sort out the joining data
      // row nodes that needs to be joined
      join_row_nodes.push(right_row_nodes[data[d][j]["dest"]]);

      // the number that cells should be inserted into), +1 to compansate the column header
      // + shift_cnt to compansate the shiftrows
      join_row_selnum.push(data[d][j]["row"] + 1 + shift_cnt);
    }

    // get the xy of the line from base rect
    base_key_rect_xy = rect_mid_cord(base_key_rect)[0];
    // the ["x"] * the number of rows shifted (adjust)
    base_key_rect_xy["y"] = base_key_rect_xy["y"] + height * shift_adjy;
    // link the key rects with lines
    delay_time = link_rect_line(base_key_rect, base_key_rect_xy, dest_key_rect, "right",
      line_tran_time, delay_time, msg);
    // shift down rows if needed
    if (data[d].length > 1) {
      // the number of rows to shift down
      shiftdown_no_times = data[d].length - 1;
      // +1 to compensate for the column name right_row_nodes
      row2shift = data[d][0]["row"] + 1;
      // counter for number of rows shifted down (OVERALL)
      shift_cnt = shift_cnt + shiftdown_no_times;
      // adjust join_row_selnum, if i > 0 then +1 since if shift row
      // the first row of the join_row_selnum will be the original one
      join_row_selnum = join_row_selnum.map((d2, i2) => {
        if (i2 == 0) {
          return d2;
        } else {
          return d2 + i2;
        }
      })

      shift_row_down("x", og_xtbl, row2shift, shiftdown_no_times, height, shiftdown_time,
        delay_time);

      shift_adjy = shift_adjy + data[d].length - 1;
      // +1 since we want shifting and joining at the same time
      delay_time2 = delay_time + 1;
    } else {
      delay_time2 = delay_time;
    }
    // moving key cell animation
    // 1- this includes moving cell to the left of table x (rect & txt)
    // 2- showing na rects
    // using delay_time2 here instead of stacking delay_time since it cause
    // confusion in the code
    // if(d == "4") debugger;
    // debugger;
    delay_time3 = movexy_cell_wobj(join_row_nodes, new_xy[d], height,
      ytbl_nkey_wd, join_tran_time, delay_time2, join_row_selnum, join_type, msg);
    delay_time = delay_time2 + delay_time3;

    // gary out used rows
    if (gray_out === true) {
      join_row_nodes.forEach(function (d, i) {
        d3.select(d)
          .transition()
          .delay(delay_time)
          .duration(gray_time)
          .style("opacity", 0.3);
      })
      delay_time = delay_time + gray_time;
    }

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

  // shiftdown count
  let shift_cnt = 1;
  // shift_adjy is to keep count how many times rows has been shifted
  let shift_adjy = 1;
  //
  let line_tran_time = 1200 / speed;
  let shiftdown_time = 1500 / speed;
  let join_tran_time = 1500 / speed;
  let gray_time = 200 / speed;
  let delay_time = 0;

  // link keycol rects
  d3.keys(data).forEach(function (d, i) {
      let msg = {
          msg: data[d][0].msg,
          when: data[d][0].when
      };
      d3.select("svg")
          .transition()
          .delay(delay_time)
          .on("end", function () {
              data[d].forEach(function (d2, i2) {
                  ///////////////////////// link key col //////////////////////////
                  cur_left_keycol_rect = d3.select(left_kcol_node[(data[d][i2]["row"])]).select("rect").node();
                  left_keycolrect_mid = (rect_mid_cord(cur_left_keycol_rect))[0];
                  if (data[d][i2]["dest"] == -1) {
                      cur_right_keycol_rect = -1
                  } else {
                      cur_right_keycol_rect = d3.select(right_kcol_node[(data[d][i2]["dest"])]).select("rect").node();
                      right_keycolrect_mid = (rect_mid_cord(cur_right_keycol_rect))[0];
                  }
                  return_delay = link_rect_line(cur_left_keycol_rect, left_keycolrect_mid,
                      cur_right_keycol_rect, "right", line_tran_time, 0, msg, removeall = true);
                  /////////////////////////////////////////////////////////////////

                  //////////////////////// join data ////////////////////////////
                  cur_rows2move = d3.select(right_row_nodes[d2["dest"]]).selectAll(".y_cols:not(.y_cols_key)").nodes();
                  cur_rows2move.forEach(function (d33, i3) {
                      // if(i2 == 1) debugger;
                      cur_rectwidth = d3.select(d33).select("rect").attr("width");
                      movexy_cell(cur_rows2move[i3], new_xy[1][0]["x"][i3], new_xy[1][0]["y"] - height + shift_adjy * height, new_xy[1][0]["x"][i3],
                          new_xy[1][0]["y"] - height + shift_adjy * height, height, cur_rectwidth, join_tran_time, return_delay,
                          `.x_rows:nth-child(${data[d][i2]["row"] + shift_cnt})`, msg, false);
                  })
                  shift_adjy = shift_adjy + 1
                  /////////////////////////////////////////////////////////////////

              })
              // shift down if necessary
              if (data[d].length > 1) {
                  shift_row_down("x", og_xtbl, data[d][0]["row"] + shift_cnt, data[d].length - 1, height, shiftdown_time,
                      0);
                  shift_cnt = shift_cnt + data[d].length - 1;
              }


          })

      delay_time = delay_time + line_tran_time + join_tran_time;


      if (data[d][0]["dest"] == -1) {
          d3.select("svg")
              .transition()
              .delay(delay_time)
              .on("end", function () {
                  d3.select(`.x_rows:nth-child(${data[d][0]["row"] + shift_cnt})`)
                      .classed("remove_row", true)
                      .transition()
                      .duration(join_tran_time)
                      .style("opacity", 0);
              })
          delay_time = delay_time + join_tran_time;
      }
  })
  d3.select("svg")
      .transition()
      .delay(delay_time)
      .on("end", function () {
          console.log("hi")
          console.log(left_row_nodes)
      })

  return delay_time;
}

function innerjoin_final(data) {
  // after shifting, some rows will be in the incorrect position, this function
  // puts the joined text and rect back into the correct position
  let all_xrows = d3.selectAll(".x_rows").nodes();
  let cnt = 1;
  let bad_xrows = new Array();
  // find bad rows, rows that contain extra rect and text
  d3.keys(data).forEach(function (d, i) {
      if (data[d].length > 1) {
          bad_xrows.push(cnt);
      }
      cnt += data[d].length;
  })
  let num_ynkey_col = d3.select(".y_rows")
      .selectAll(".y_cols:not(.y_cols_key)")
      .nodes().length;
  console.log(all_xrows)
  //  find bad rect and text
  d3.select("svg")
      .transition()
      .delay(250)
      .on("end", function() {
          bad_xrows.forEach(function (d, i) {
              // if(i == 3)
              // debugger;
              // window.dd = d3.select(all_xrows[d]).node()
              cur_badrect = d3.selectAll(`.x_rows:nth-child(${d + 1}) > rect`).nodes();
              cur_badtext = d3.selectAll(`.x_rows:nth-child(${d + 1}) > text`).nodes();

              // number of times to iterate, minus 1 since we keep 1 set in the current row.lemonkiwi878
              // this number of times is the number of sets that need to be moved
              iterate_times = cur_badrect.length / num_ynkey_col - 1;
              // remove first n elements from the badrect/text array since they should stay
              cur_badrect = cur_badrect.slice(num_ynkey_col, cur_badrect.length);
              cur_badtext = cur_badtext.slice(num_ynkey_col, cur_badtext.length);
              // loop
              for (let j = 1; j <= iterate_times; j++) {
                  for (let k = 0; k < num_ynkey_col; k++) {
                      // insert rects
                      d3.select(`.x_rows:nth-child(${d + 1 + j})`)
                          .insert(function () {
                              return cur_badrect[0];
                          })
                      // insert text
                      d3.select(`.x_rows:nth-child(${d + 1 + j})`)
                          .insert(function () {
                              return cur_badtext[0];
                          })
                      // remove 1 from the start of array since we are inserting by [0]
                      cur_badrect.shift();
                      cur_badtext.shift();
                  }
              }
          })
      })

  return d3.select("svg").transition()
      .delay(500);
}
