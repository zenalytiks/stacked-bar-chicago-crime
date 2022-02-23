var traces = [];
dfd.read_json("https://raw.githubusercontent.com/kim785/Project2/main/static/dump_summary_dict.json")
   .then(df => {

    df.drop({ columns: ["description","year"], inplace: true });
    const ordered_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const df_list = [];
    for (const month of ordered_months) {
      const df_filtered = df.query({ column: "crime_month_name", is: "==", to: month});
      df_filtered.rename({ mapper: {"0": "crime_month_name","1":"primary_type","2":"reported_crime"}, inplace: true });
      groupby_df = df_filtered.groupby(["crime_month_name","primary_type"]).sum();
      groupby_df.rename({mapper: {"reported_crime_sum":"reported_crime"}, inplace: true});
      groupby_df.sort_values({by:'reported_crime',ascending:false,inplace:true});
      df_top_10 = groupby_df.head(10);
      df_list.push(df_top_10);


    }
    df = dfd.concat({ df_list: df_list, axis: 0 });

    var colors = {};
    var colors_list=['#e6194B','#3cb44b','#ffe119','#4363d8','#f58231','#911eb4','#42d4f4','#f032e6','#bfef45','#fabed4','#469990'];


    df['primary_type'].unique().values.forEach((num1, index) => {
      colors[num1] = colors_list[index];
    });

    for (const type of df['primary_type'].unique().values) {
      const df_filtered = df.query({ column: "primary_type", is: "==", to: type});
      df_bar = df_filtered.rename({ mapper: {"0": "crime_month_name","1":"primary_type","2":"reported_crime"}});
      traces.push({
        data: df_bar['reported_crime'].values,
        name: type,
        color:colors[type]
      });
    }

    Highcharts.chart('gd', {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Chicago Crime 2020'
    },
    xAxis: {
      categories: df['crime_month_name'].unique().values
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total fruit consumption'
      }
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },
    series: traces
  });


});
