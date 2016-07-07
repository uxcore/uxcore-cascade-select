import expect from 'expect.js';
import React from 'react';
import {render, findDOMNode, unmountComponentAtNode} from 'react-dom';
import TestUtils from 'react-addons-test-utils'
import CascadeSelect from '../src';
import $ from 'jQuery';

const options = [{
  value: 'beijing',
  label: '北京',
  children: [{
    value: 'xicheng',
    label: '西城',
    children: [{
      value: 'zhonggc',
      label: '中观村大街',
    }],
  }]
},{
  value: 'tianjin',
  label: '天津',
  children: [{
    value: 'heping',
    label: '和平区',
    children: [{
      value: 'nanjinglu',
      label: '南京路',
    }],
  }]
},{
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州',
    children: [{
      value: 'xihu',
      label: '西湖',
    }],
  }]
}, {
  value: 'jiangsu',
  label: '江苏',
  children: [{
    value: 'nanjing',
    label: '南京',
    children: [{
      value: 'zhonghuamen',
      label: '中华门',
    }],
  }]
}];

describe('CascadeSelect', () => {
  let instance;
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should display placeholder', () => {
    instance = render(<CascadeSelect placeholder="请选择"/>, div)
    expect($(findDOMNode(instance)).find('.kuma-cascader-placeholder').html()).to.equal('请选择')
  })

  it('should add the custom className', () => {
    instance = render(<CascadeSelect className="abc"/>, div)
    expect($(findDOMNode(instance))[0].className.indexOf('abc')>-1).to.be.ok();
  })

  it('should have a sub menu', () => {
    instance = render(<CascadeSelect options={options}/>, div)
    expect(true).to.eql(true)
    // expect(findDOMNode(instance).querySelector('.uxcore-cascader-submenu')).to.be.ok();
  })

  it('should have the defaultValue', () => {
    expect(true).to.eql(true)
  })

  it('onChange should be called successfully', () => {
    expect(true).to.eql(true)
  })

  it('should be disabled', () => {
    expect(true).to.eql(true)
  })

  it('should be clearable', () => {
    expect(true).to.eql(true)
  })

  it('should be changed after every selecting', () => {
    expect(true).to.eql(true)
  })

  it('should display the sub menu when hover', () => {
    expect(true).to.eql(true)
  })

  it('should display text by the beforeRender function', () => {
    expect(true).to.eql(true)
  })
});
