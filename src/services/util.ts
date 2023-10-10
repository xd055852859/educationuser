import { ResultProps } from "@/interface/Common";
import * as qiniu from "qiniu-js";
import api from "./api";
import { ElMessage } from "element-plus";

export const getSearchParamValue = (search: string, paramName: string) => {
  const QUERY_PARAMS: string = new URLSearchParams(search).get(
    paramName
  ) as string;
  if (QUERY_PARAMS) {
    return QUERY_PARAMS;
  } else {
    return null;
  }
};

// 生成标识符
export const guid = (len, radix) => {
  var chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  var uuid: any = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
};

export const uploadFile = async (
  file,
  mimeType,
  callback,
  fileType?: string
) => {
  if (!file) {
    // dispatch(setMessage([true, "error", "无文件"]));
    return;
  }
  // if (file.size > 20000000) {
  //   alert("文件不能大于20M,请重新选择");
  //   return;
  // }
  let uploadRes: any = await api.request.get("account/qiniuToken", {
    target: "cdn-feisuo",
  });
  if (uploadRes.msg === "OK") {
    let uptoken = uploadRes.data;
    const domain = "https://cdn-feisuo.qingtime.cn/";
    let putExtra = {
      // 文件原文件名
      fname: "",
      // 自定义变量
      params: {},
      // 限制上传文件类型
      mimeType: mimeType,
    };
    let config = {
      useCdnDomain: true,
      disableStatisticsReport: false,
      retryCount: 5,
      region:  qiniu.region["cn-east-2"],
      forceDirect: true,
    };
    let observer = {
      next(res) {},
      error(err) {
        ElMessage.error(err.message);
      },
      complete(res) {
        console.log(domain + res.key);
        callback(domain + res.key, file.name);
        //return domain + res.key;
      },
    };
    // 上传
    let observable = qiniu.upload(
      file,
      fileType
        ? new Date().getTime() + "org." + fileType
        : new Date().getTime() +
            "_org" +
            (file.name ? file.name.substr(file.name.lastIndexOf(".")) : ".png"),
      uptoken,
      putExtra,
      config
    );
    // 上传开始
    observable.subscribe(observer);
  }
};
export const is_mobile = () => {
  let regex_match =
    /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220|Mobile|iPad)/i;
  let u = navigator.userAgent;
  if (null == u) {
    return true;
  }
  let result = regex_match.exec(u);

  if (null == result) {
    return false;
  } else {
    return true;
  }
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    ///FileReader类就是专门用来读文件的
    const reader = new FileReader();
    //开始读文件
    //readAsDataURL: dataurl它的本质就是图片的二进制数据， 进行base64加密后形成的一个字符串，
    reader.readAsDataURL(file);
    // 成功和失败返回对应的信息，reader.result一个base64，可以直接使用
    reader.onload = () => resolve(reader.result);
    // 失败返回失败的信息
    reader.onerror = (error) => reject(error);
  });
};
export const bytesToSize = (limit) => {
  var size = "";
  if (limit < 1024) {
    //小于0.1KB，则转化成B
    size = limit.toFixed(2) + "B";
  } else if (limit < 1024 * 1024) {
    //小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 1024 * 1024 * 1024) {
    //小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else if (limit < 1024 * 1024 * 1024 * 1024) {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  } else {
    size = (limit / (1024 * 1024 * 1024 * 1024)).toFixed(2) + "TB";
  }

  var sizeStr = size + ""; //转成字符串
  var index = sizeStr.indexOf("."); //获取小数点处的索引
  var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
  if (dou == "00") {
    //判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
  }
  return size;
};
export const loadFont = async (fontName, fontUrl) => {
  const font = new FontFace(fontName, `url(${fontUrl})`);
  await font.load();
  //@ts-ignore
  document.fonts.add(font);
};

export const useImageUrl = (
  folder: string = "",
  name: string,
  type: string = "png"
): string => {
  /**
   * @method vite动态引入图片
   * @params folder 文件夹名称 name 文件名称 type 文件格式 一般为png/jpg/webp/gif等...
   * @returns 图片
   */
  //useImageUrl('home', 'banner1', 'png')
  return new URL(`../assets/${folder}/${name}.${type}`, import.meta.url).href;
};

//下载文件
export const downloadFile = (url, fileName) => {
  fetch(url, {
    method: "get",
    mode: "no-cors",
    referrerPolicy: "no-referrer",
  })
    .then((res) => res.blob())
    .then((res) => {
      const aElement = document.createElement("a");
      aElement.setAttribute("download", fileName);
      const href = URL.createObjectURL(res);
      aElement.href = href;
      aElement.setAttribute("target", "_blank");
      aElement.click();
      URL.revokeObjectURL(href);
    });
};
//转换树
export const formatData = (nodes: any, nodeId: string) => {
  let obj: any = {
    ...nodes[nodeId],
    key: nodeId,
    label: nodes[nodeId].name,
    children: [],
  };

  if (nodes[nodeId].sortList.length > 0) {
    nodes[nodeId].sortList.forEach((item: any) => {
      let nodeItem = formatData(nodes, item);
      obj.children.push(nodeItem);
    });
  }
  return obj;
};
export const dataURLtoFile = (dataurl, fileName) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  //@ts-ignore
  return new File([u8arr], fileName, { type: mime });
};
//压缩图片
export const compressImg = (file) => {
  var src;
  var files;
  //@ts-ignore
  var fileSize: any = parseFloat(parseInt(file["size"]) / 1024 / 1024).toFixed(
    2
  );
  var read = new FileReader();
  read.readAsDataURL(file);

  return new Promise(function (resolve, reject) {
    read.onload = function (e) {
      var img: any = new Image();
      //@ts-ignore
      img.src = e.target.result;
      img.onload = function () {
        //默认按比例压缩
        var w = this.width,
          h = this.height;
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx: any = canvas.getContext("2d");
        var base64;
        // 创建属性节点
        canvas.setAttribute("width", w);
        canvas.setAttribute("height", h);
        ctx.drawImage(this, 0, 0, w, h);
        if (fileSize < 2) {
          //如果图片小于一兆 那么不执行压缩操作
          base64 = canvas.toDataURL(file["type"], 1);
        } else if (2 <= fileSize && fileSize < 10) {
          //如果图片大于1M并且小于2M 那么压缩0.5
          base64 = canvas.toDataURL(file["type"], 0.8);
        } else if (10 <= fileSize && fileSize < 20) {
          //如果图片大于1M并且小于2M 那么压缩0.5
          base64 = canvas.toDataURL(file["type"], 0.5);
        } else if (fileSize >= 20) {
          //如果图片大于1M并且小于2M 那么压缩0.5
          base64 = canvas.toDataURL(file["type"], 0.3);
        }
        // 回调函数返回file的值（将base64编码转成file）
        files = dataURLtoFile(base64, file.name); //如果后台接收类型为base64的话这一步可以省略

        resolve(files);
      };
    };
  });
};
export const loadJS = (jsUrl, callback, isCache = false) => {
  var script = document.createElement("script");
  var head = document.head;
  script.type = "text/JavaScript";
  if (isCache) {
    script.src = jsUrl + "?t=" + new Date().getTime();
  } else {
    script.src = jsUrl;
  }
  if (script.addEventListener) {
    script.addEventListener("load", callback, false);
  }
  head.appendChild(script);
};
export const checkMobile = (rule: any, value: any, callback: any) => {
  let reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/g;
  if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的手机号码"));
  } else {
    callback();
  }
};
export const checkEmail = (rule: any, value: any, callback: any) => {
  let reg =
    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/g;
  if (value && !reg.test(value)) {
    callback(new Error("请输入正确的邮箱账号"));
  } else {
    callback();
  }
};
export const checkPassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error("请输入密码"));
  } else if (!value.trim()) {
    callback(new Error("密码不能为空或者仅有空格"));
  } else {
    callback();
  }
};
