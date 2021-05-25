/*
* 检查client是否在线
* */
export const checkClient = (c) => {
  console.log('进入检查client')
  return new Promise((resolve) => {
    setInterval(() => {
      if (c) {
        resolve();
      }
    }, 50);
  });
};

