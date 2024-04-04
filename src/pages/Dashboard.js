import React, { useEffect } from "react";
import styles from "../styles/dashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getproductsData } from "../store/products-actions";
import { CanvasJSChart } from "canvasjs-react-charts";

function calculateTotalStockByCategory(products) {
  const categories = {};
  let totalStock = 0;

  products.forEach((product) => {
    const { category, stock } = product;
    if (!categories[category]) {
      categories[category] = 0;
    }
    categories[category] += stock;
    totalStock += stock;
  });

  const result = Object.keys(categories).map((category) => ({
    category,
    stock: categories[category],
    stockpercentage: Number(
      ((categories[category] / totalStock) * 100).toFixed(2)
    ),
  }));

  return result;
}

function calculateMinMaxPriceByCategory(products) {
  const categoryPriceMap = {};

  products.forEach((product) => {
    const { category, price } = product;
    if (categoryPriceMap.hasOwnProperty(category)) {
      const { min, max } = categoryPriceMap[category].price;
      categoryPriceMap[category].price.min = Math.min(min, price);
      categoryPriceMap[category].price.max = Math.max(max, price);
    } else {
      categoryPriceMap[category] = {
        category: category,
        price: {
          min: price,
          max: price,
        },
      };
    }
  });

  const categoryPriceArray = Object.values(categoryPriceMap).map((item) => ({
    category: item.category,
    price: {
      min: item.price.min,
      max: item.price.max,
    },
  }));

  return categoryPriceArray;
}

export function Dashboard() {
  const { products, isLoading } = useSelector((state) => state.prod);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!products.length) {
      dispatch(getproductsData());
    }
  }, [dispatch, products]);

  const minmaxPriceByCategory = {
    animationEnabled: true,
    title: {
      text: "Minimum Maximum Price Range",
      fontFamily: "helvetica",
    },
    subtitles: [
      {
        text: "Based on Category",
        fontFamily: "helvetica",
      },
    ],
    data: [
      {
        type: "rangeBar",
        indexLabel: "${y[#index]}",
        yValueFormatString: "#,##0",
        dataPoints: calculateMinMaxPriceByCategory(products)?.map((product) => {
          return {
            label: product.category,
            y: [
              product.price.min,
              product.price.max < 400
                ? product.price.max + 400
                : product.price.max,
            ],
          };
        }),
      },
    ],
  };

  const stockAvaliabilityBycategory = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Stocks Avaliability By Category",
    },
    data: [
      {
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}%",
        dataPoints: calculateTotalStockByCategory(products).map((data) => {
          return { y: data.stockpercentage, label: data.category };
        }),
      },
    ],
  };

  return (
    <div className={styles.dashboard_container}>
      {isLoading && <div className={styles.loading_container}>Loading...</div>}
      {!isLoading && (
        <>
          <div className={styles.chart_container}>
            <CanvasJSChart options={minmaxPriceByCategory} />
          </div>
          <div className={styles.chart_container}>
            <CanvasJSChart options={stockAvaliabilityBycategory} />
          </div>
        </>
      )}
    </div>
  );
}
