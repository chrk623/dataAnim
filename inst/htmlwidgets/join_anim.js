// this js file has to have their own yaml file.
HTMLWidgets.widget({

  name: 'join_anim',

  type: 'output',

  factory: function (el, width, height) {

    // TODO: define shared variables for this instance
    let svg_width = width * 0.8;
    let svg_height = svg_width / 1.6;


    return {

      renderValue: function (x) {
        let data = x.data;
        let speed = x.speed;
        let join_type = x.join_type;

        let xtbl_width = arr_sum(data.x_w[0]);
        let ytbl_width = arr_sum(data.y_w[0]);
        let xy_width = xtbl_width + ytbl_width;
        // tbl height

        let cell_height = data.height[0];

        // let cell_height = 10;
        // 10%+ margin, 50% middle space
        let xscale_num = (xy_width + 1.5 * ytbl_width) / 0.9;
        let yscale_num = cell_height * (data.x.length + data.y.length - 1) / 0.9;

        d3.select(el)
          .append("svg")
          .attr("width", svg_width)
          .attr("height", svg_height);


        // Scales
        let x_scale =
          d3.scaleLinear()
          .domain([0, xscale_num])
          .range([0, svg_width]);
        let y_scale =
          d3.scaleLinear()
          .domain([0, yscale_num])
          .range([0, svg_height]);

        let height = y_scale(cell_height);


        let xtbl_start = {
          x: svg_width * 0.05,
          y: svg_height * 0.05
        };
        let ytbl_start = {
          x: svg_width - svg_width * 0.05 - x_scale(ytbl_width),
          y: svg_height * 0.05
        };

        // width of tables
        let x_width = arr_scale(data.x_w[0], x_scale);
        // console.log(data.x_w[0])
        let y_width = arr_scale(data.y_w[0], x_scale);
        // x cords of table x and y
        let x_cord_x = arr_scale(data.x_cord_x, x_scale);
        let x_cord_y = arr_scale(data.x_cord_y, x_scale);
        // y cords of table x and y
        let y_cord_x = Array.from(Array(data.x.length), (d, i) => i * height);
        let y_cord_y = Array.from(Array(data.y.length), (d, i) => i * height);


        x_rect_cord = draw_table(data.x, xtbl_start["x"], xtbl_start["y"], x_cord_x,
          x_width, height, "x", parseInt(data.x_key_col));

        y_rect_cord = draw_table(data.y, ytbl_start["x"], ytbl_start["y"], x_cord_y,
          y_width, height, "y", parseInt(data.y_key_col));

          let iso_action = join_type;
          if (join_type == "complete") {
            join_type = "left";
          }
          keycol_anim("x", "y", speed)
            .on("end", function() {
              join_anim(data.initial_prep, speed, join_type)
                .on("end", () => {
                  if (iso_action === "complete") {
                    comjoin_final(data.com_act)
                      .on("end", () => {
                        iso_tbl(join_type, height, speed, 0);
                      });
                  } else {
                    iso_tbl(join_type, height, speed, 0);
                  }
                });
            });

      },

      resize: function (width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
