import { useEffect } from 'react';

// Solución a "unexpected token" al usar amcharts en Next.js
let am4core:any = null;
let am4charts:any = null;
let am4themesAnimated = null;
if (process.browser) {
	am4core = require('@amcharts/amcharts4/core');
	am4charts = require('@amcharts/amcharts4/charts');
	am4themesAnimated = require('@amcharts/amcharts4/themes/animated');
	am4core.useTheme(am4themesAnimated.default);
}

export default function Chart({ chartData }:any) {
	useEffect(() => {
    let chart = am4core.create('chartdiv', am4charts.XYChart);
    chart.colors.list = [
      // am4core.color('#FF6F91'),
      // am4core.color('#845EC2'),
      am4core.color('#00FF00'),
      am4core.color('#FF0000'),
      am4core.color('#FFC75F'),
      am4core.color('#0000FF'),
      am4core.color('#D65DB1'),
      am4core.color('#FF9671'),
    ];

    chart.paddingRight = 20;

    let data = [];

    const arrData = chartData?.data;

    for (let i = 1; i < arrData?.length - 1; i++) {
      const date = new Date(arrData[i][0] * 1000);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.getMonth().toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      const formattedTime =
        day + '/' + month + '/' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

      data.push({
        date: formattedTime,
        [arrData[0][20]]: arrData[i][20],
      });
    }

    //
    // for (let i = 1; i < 366; i++) {
    // 	data.push({ date: new Date(2018, 0, i), name: 'name' + i });
    // }

    chart.dateFormatter.inputDateFormat = 'dd/MM/yyyy HH:mm:ss';

    chart.data = data;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.baseInterval = {
      timeUnit: 'second',
      count: 1,
    };

    dateAxis.tooltipDateFormat = 'dd/MM/yyyy HH:mm:ss';

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    const series = chart.series.push(new am4charts.StepLineSeries());
    series.name = 'Entrada_A_1';
    series.dataFields.valueY = 'Entrada_A_1';
    series.dataFields.dateX = 'date';
    series.strokeWidth = 3;

    // Configuro todos los datos en el mismo tooltip
    series.adapter.add('tooltipText', () => {
      let text = '{dateX.formatDate("dd/MM/yyyy")}\n[bold]{dateX.formatDate("HH:mm:ss")}hs[/]\n';

      chart.series.each(function (item: any) {
        if (!item.isHidden) {
          text += '[' + item.stroke.hex + ']●[/] ' + item.name + ': {' + item.dataFields.valueY + '}\n';
        }
      });
      return text;
    });

    // Para evitar que el color del tooltip sea el mismo que el de la primera curva
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color('#fff');
    series.tooltip.label.fill = am4core.color('#000');

    // Prevent cross-fading of tooltips
    series.tooltip.defaultState.transitionDuration = 0;
    series.tooltip.hiddenState.transitionDuration = 0;

    // const bullet = series.bullets.push(new am4charts.CircleBullet());
    // bullet.circle.stroke = am4core.color('#fff');
    // bullet.circle.strokeWidth = 1;

    //
    chart.cursor = new am4charts.XYCursor();

    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;
    //
    // Agrego leyenda indicadora de color de cada serie
    chart.legend = new am4charts.Legend();

    chart.cursor.maxTooltipDistance = 0;

    return () => {
      chart.dispose();
    };
  }, [chartData]);

  console.log('chartData', chartData);
  // console.log(data[1].data[2]);

  return (
    <>
      {chartData.data?.length > 0 ? (
        <div id='chartdiv' style={{ width: '100%', height: '500px' }}></div>
      ) : (
        <h4>No se ha cargado ningún archivo</h4>
      )}
    </>
  );
}