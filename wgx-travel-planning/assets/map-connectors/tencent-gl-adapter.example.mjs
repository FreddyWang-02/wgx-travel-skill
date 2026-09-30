/**
 * 腾讯位置服务 JavaScript API GL 适配器示例。
 *
 * 用法（宿主在 app.mjs 运行前注册）：
 *   import { createTencentMapAdapter } from "./map-connectors/tencent-gl-adapter.example.mjs";
 *   window.TRAVEL_MAP_ADAPTER = createTencentMapAdapter({
 *     mode: "proxy",                    // "proxy"（WorkBuddy 默认，前端零 Key）或 "own-key"
 *     serviceHost: "http://127.0.0.1:__WB_HTTP_PORT__/_TMapService/_wbt/__WB_TMAP_SECRET__",
 *     ownKey: "",                       // mode:"own-key" 时填写用户在 lbs.qq.com 申请的 Web 端 Key
 *   });
 *
 * 合规要点（与 references/map-connector-setup.md 一致）：
 * - 禁止把可用的 Key 提交进仓库或写入 TravelPack；proxy 模式占位符由 WorkBuddy 运行时替换。
 * - own-key 模式仅为占位说明，运行时必须由用户自行替换，并配置域名白名单。
 * - 底图展示需保留「© Tencent - GS审图号」等官方版权标识（GL JS 默认渲染，请勿遮挡）。
 * - TravelPack 坐标为 WGS84，腾讯底图为 GCJ-02，本文件内置标准偏移转换。
 */
import { createTravelMapAdapter } from "../frontend-template/map-adapter.mjs";

// WGS84 -> GCJ-02（火星坐标）。标准公开偏移算法，误差在米级以内。
function wgs84ToGcj02(lat, lng) {
  const OUT_OF_CHINA = lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
  if (OUT_OF_CHINA) return { lat, lng };
  const a = 6378245;
  const ee = 0.00669342162296594323;
  const transformLat = (x, y) => {
    let ret = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
    ret += (20 * Math.sin(y * Math.PI) + 40 * Math.sin(y / 3 * Math.PI)) * 2 / 3;
    ret += (160 * Math.sin(y / 12 * Math.PI) + 320 * Math.sin(y * Math.PI / 30)) * 2 / 3;
    return ret;
  };
  const transformLng = (x, y) => {
    let ret = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
    ret += (20 * Math.sin(x * Math.PI) + 40 * Math.sin(x / 3 * Math.PI)) * 2 / 3;
    ret += (150 * Math.sin(x / 12 * Math.PI) + 300 * Math.sin(x / 30 * Math.PI)) * 2 / 3;
    return ret;
  };
  let dLat = transformLat(lng - 105, lat - 35);
  let dLng = transformLng(lng - 105, lat - 35);
  const radLat = lat / 180 * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
  dLng = (dLng * 180) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
  return { lat: lat + dLat, lng: lng + dLng };
}

function loadTencentSdk({ mode, serviceHost, ownKey }) {
  return new Promise((resolve, reject) => {
    if (window.TMap) return resolve(window.TMap);
    if (mode === "proxy") {
      if (!serviceHost || serviceHost.includes("__WB_")) {
        return reject(new Error("proxy 模式需要 WorkBuddy 运行时注入的 serviceHost"));
      }
      window._TMapSecurityConfig = { serviceHost };
    }
    const script = document.createElement("script");
    script.src = mode === "own-key"
      ? `https://map.qq.com/api/gljs?v=1.exp&key=${encodeURIComponent(ownKey || "请在腾讯位置服务 lbs.qq.com 申请 Web 端 Key 并替换此占位符")}`
      : "https://map.qq.com/api/gljs?v=1.exp";
    script.async = true;
    script.onload = () => (window.TMap ? resolve(window.TMap) : reject(new Error("TMap 加载失败")));
    script.onerror = () => reject(new Error("腾讯地图 SDK 加载失败，请检查网络"));
    document.head.appendChild(script);
  });
}

export function createTencentMapAdapter({ mode = "proxy", serviceHost = "", ownKey = "" } = {}) {
  return createTravelMapAdapter({
    provider: "腾讯地图",
    mount: async ({ container, days }) => {
      const TMap = await loadTencentSdk({ mode, serviceHost, ownKey });
      const stops = (days || []).flatMap((day) => (day.stops || []).filter((s) => s.location));
      if (!stops.length) return undefined;

      const gcj = stops.map((s) => ({ ...s, gcj: wgs84ToGcj02(s.location.latitude, s.location.longitude) }));
      const first = gcj[0].gcj;
      const map = new TMap.Map(container, {
        zoom: 10,
        center: new TMap.LatLng(first.lat, first.lng),
        showControl: true,
      });

      const markerStyle = new TMap.MarkerStyle({
        width: 24, height: 32,
        anchor: { x: 12, y: 32 },
        color: "#22303F",
      });
      new TMap.MultiMarker({
        map,
        styles: { numbered: markerStyle },
        geometries: gcj.map((s, i) => ({
          id: String(i),
          styleId: "numbered",
          position: new TMap.LatLng(s.gcj.lat, s.gcj.lng),
          properties: { title: s.name, day: s.dayId },
        })),
      });

      const path = gcj.map((s) => new TMap.LatLng(s.gcj.lat, s.gcj.lng));
      new TMap.MultiPolyline({
        map,
        styles: { route: new TMap.PolylineStyle({ color: "#F08A5D", width: 4, lineCap: "round" }) },
        geometries: [{ id: "route", styleId: "route", paths: [path] }],
      });

      return {
        remove() { map.destroy(); },
      };
    },
  });
}
