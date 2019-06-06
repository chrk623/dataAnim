// this js file has to have their own yaml file.
HTMLWidgets.widget({

  name: 'spread_anim',

  type: 'output',

  factory: function (el, width, height) {
    let svg_width = width * 0.8;
    let svg_height = svg_width / 1.6;

    return {
      renderValue: function (x) {
        let data = x.data;
        window.data = data;
        svg_div = "animpanel0";
        let svg_width = data.svg_width[0];
        let svg_height = data.svg_height[0];
        let otbl_width = arr_sum(data.og_w[0]);
        let rtbl_width = arr_sum(data.rslt_w[0]);
        let or_width = otbl_width + rtbl_width;
        let cell_height = data.height[0];
        let xscale_num = (or_width + 1.5 * rtbl_width) / 0.9;
        let yscale_num = cell_height * (data.original.length + data.original.length - 1) / 0.9;
        el = d3.select("body")
          .append("div")
          .attr("id", svg_div);
        el.append("svg")
          .attr("width", svg_width)
          .attr("height", svg_height);
        let x_scale =
          d3.scaleLinear()
          .domain([0, xscale_num])
          .range([0, svg_width]);
        let y_scale =
          d3.scaleLinear()
          .domain([0, yscale_num])
          .range([0, svg_height]);
        let height = y_scale(cell_height);
        let otbl_start = {
          x: svg_width * 0.05,
          y: svg_height * 0.25
        };
        let ptxt_start = {
          x: svg_width * 0.015,
          y: svg_height * 0.05
        };
        let o_width = arr_scale(data.og_w[0], x_scale);
        let x_cord_o = arr_scale(data.og_cord_x, x_scale);
        let rslt_cord_x = arr_scale(data.rslt_cord_x, x_scale);
        let r_width = arr_scale(data.rslt_w[0], x_scale);
        let r_tbl_tl = {
          x: svg_width - svg_width * 0.05 - arr_sum(r_width),
          y: otbl_start["y"]
        };
        let key_rect_w = x_scale(data.rslt_w[0][data.key_ind[0] - 1]);
        let value_rect_w = x_scale(data.rslt_w[0][data.value_ind[0] - 1]);
        let tbl_mid_xy = {
          x: svg_width / 2,
          y: svg_height / 2
        };

        draw_table_rectonly(data.result, r_tbl_tl["x"], r_tbl_tl["y"], rslt_cord_x,
          r_width, height, "r", parseInt(data.pivot_ind), false);
        d3.selectAll(".r_rows")
          .style("opacity", 0);

        input_text_node = d3.select(".r_rows").selectAll(".r_cols").nodes();
        input_text_node.forEach(function (d, i) {
          cur_rect = d3.select(input_text_node[i])
            .select("rect");
          d3.select(input_text_node[i])
            .append("text")
            .attr("x", parseFloat(cur_rect.attr("x")) + parseFloat(cur_rect.attr("width") / 2))
            .attr("y", parseFloat(cur_rect.attr("y")) + parseFloat(cur_rect.attr("height") / 2))
            .style("font-size", height * 0.5)
            .text(data.rslt_cn[i]);
        })

        x_rect_cord = draw_table(data.original, otbl_start["x"], otbl_start["y"], x_cord_o,
          o_width, height, "o", parseInt(data.pivot_ind));

        let all_o_rows = d3.selectAll(".o_rows")
          .nodes();
        let delay_time = 2000;
        let msg = true;
        let speed = data.speed;
        let new_col_cnt = 2;

        prepare_spread(ptxt_start, data.key[0], data.value[0], data.key_ind[0], key_rect_w,
            value_rect_w, data.key_seq, height, delay_time, speed)
          .on("end", function () {
            d3.selectAll(".r_rows").style("opacity", 1)
            spread_anim_pivot(tbl_mid_xy, data.pivot[0], data.pivot_rows, speed, delay_time, msg = true)
              .on("end", function () {
                d3.selectAll(".removed").remove();
                data.key_seq.forEach(function (d, i) {
                  current_chunk = all_o_rows.slice(d["start"], d["stop"] + 1);
                  delay_time = spread_anim_move(tbl_mid_xy, current_chunk, data.key_rowseq[i],
                    data.key_ind[0], new_col_cnt, data.value_ind[0], speed, delay_time, msg);
                  msg = false;
                  new_col_cnt++;
                })
                spread_anim_fillna(data.na_pos, speed, delay_time);
              })
          });
      },

      resize: function (width, height) {}
    };
  }
});
