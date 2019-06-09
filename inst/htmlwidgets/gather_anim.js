// this js file has to have their own yaml file.
HTMLWidgets.widget({

    name: 'gather_anim',

    type: 'output',

    factory: function (el, width, height) {
        let svg_width = width * 0.8;
        let svg_height = svg_width / 1.6;
        return {
            renderValue: function (x) {
                let data = x.data;
                svg_div = "animpanel0";
                let otbl_width = arr_sum(data.og_w[0]);
                let rtbl_width = arr_sum(data.rslt_w[0]);
                let or_width = otbl_width + rtbl_width;
                let cell_height = data.height[0];
                let xscale_num = (or_width + 1.5 * rtbl_width) / 0.9;
                let yscale_num = cell_height * (data.result.length + data.result.length - 1) / 0.9;
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
                }
                let ptxt_start = {
                    x: svg_width * 0.015,
                    y: svg_height * 0.05
                }
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
                    r_width, height, "r", parseInt(data.pivot_ind));
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
                let all_r_rows = d3.selectAll(".r_rows")
                    .nodes();
                let speed = 1;
                let chunk_increment = all_o_rows.length - 1;
                let start_chunk = 1;
                let delay_time = 0;
                let tran_time = 2500 / speed;
                let msg = true;
                let first = true;
                prepare_gather(ptxt_start, data.col_ind, data.key[0], data.value[0], key_rect_w, value_rect_w, height, delay_time, 1)
                    .on("end", function () {
                        data.col_ind.forEach(function (d, i) {
                            end_chunk = start_chunk + chunk_increment;
                            current_chunk = all_r_rows.slice(start_chunk, end_chunk)
                            delay_time = gather_anim_pivot(tbl_mid_xy, current_chunk, 1, 1, speed, delay_time, msg, first);
                            delay_time = gather_anim_key(tbl_mid_xy, current_chunk, data.col[i], d, data.key[0], data.key_ind[0], speed, delay_time, msg);
                            delay_time = gather_anim_value(tbl_mid_xy, current_chunk, data.col[i], d, data.value[0], data.value_ind[0], speed, delay_time, msg);
                            if (data.col.length - 1 != i) {
                                iso_msgbox(tbl_mid_xy["x"], tbl_mid_xy["y"], height * 15, height,
                                    `Now start moving the information about ${data.col[i + 1]} into place `,
                                    delay_time, tran_time, 0.5, tran_time / 2);
                                delay_time = delay_time + tran_time;
                            }
                            msg = false;
                            first = false;
                            start_chunk = end_chunk;
                        })
                    });
            },

            resize: function (width, height) {}
        };
    }
});
