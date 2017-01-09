import expect from 'expect.js';
import React from 'react';
import $ from 'jquery';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render, findDOMNode, unmountComponentAtNode } from 'react-dom';
import CascadeSelect from '../src';

const options = [{
  value: 'alibaba',
  label: '阿里巴巴',
  children: [{
    value: 'platform',
    label: '信息平台',
    children: [{
      value: 'fe',
      label: '前端开发',
    }],
  }],
}, {
  value: 'beijing',
  label: '日本',
  children: [{
    value: 'xicheng',
    label: '西城',
    children: [
      // {
      //   value: 'zhonggc',
      //   label: '中观村大街',
      // },
    ],
  }],
}, {
  value: 'tianjin',
  label: '天津',
  children: [{
    value: 'heping',
    label: '和平区',
    children: [{
      value: 'nanjinglu',
      label: '南京路',
    }],
  }, {
    value: 'hexi',
    label: '河西区',
    children: [{
      value: 'dagu',
      label: '大沽路',
    }],
  }],
}, {
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州',
    children: [{
      value: 'xihu',
      label: '西湖',
    }],
  }],
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
  }],
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
    instance = render(<CascadeSelect placeholder="请选择" />, div);
    expect($(findDOMNode(instance)).find('.kuma-cascader-placeholder').html()).to.equal('请选择');
  });

  it('should add the custom className', () => {
    instance = render(<CascadeSelect className="abc" />, div);
    expect($(findDOMNode(instance))[0].className.indexOf('abc') > -1).to.be.ok();
  });

  it('should have a sub menu', () => {
    const wrapper = mount(<CascadeSelect options={options} />);
    wrapper.simulate('change');
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
    expect(dropdownWrapper.length > 0).to.be.ok();
  });

  it('should have the defaultValue', () => {
    instance = render(<CascadeSelect options={options} defaultValue={['alibaba', 'platform', 'fe']} />, div);
    expect($(findDOMNode(instance)).find('.kuma-cascader-trigger').find('span').text()).to.eql('阿里巴巴 / 信息平台 / 前端开发');
  });

  it('onChange should be called successfully', () => {
    const wrapper = mount(<CascadeSelect options={options} onChange={(value, selected) => {
      expect(value.length === selected.length).to.be.ok();
    }} />
    );
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
    dropdownWrapper.find('CascadeSubmenu').props().onItemClick();
  });

  it('should be disabled', () => {
    instance = render(<CascadeSelect options={options} disabled={true} />, div);
    expect($(findDOMNode(instance))[0].className.indexOf('kuma-cascader-disabled') > -1).to.be.ok();
  });

  it('should be clearable', () => {
    const wrapper = mount(<CascadeSelect options={options} clearable={true} />);
    wrapper.find('.kuma-icon-error').simulate('click');
    expect(wrapper.find('.kuma-cascader-placeholder').text()).to.eql('请选择');
  });

  it('expandTrigger', () => {
    const wrapper = mount(<CascadeSelect options={options} expandTrigger="hover" />);
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
    expect(dropdownWrapper.find('CascadeSubmenu').props().expandTrigger).to.eql('hover');
  });

  it('onItemClick', () => {
    const wrapper = mount(<CascadeSelect options={options} />);
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
    dropdownWrapper.find('li').at(0).simulate('click');
    const option = dropdownWrapper.find('CascadeSubmenu').props().options[0];
    dropdownWrapper.find('CascadeSubmenu').props().onItemClick(option,2,false);
    expect(wrapper.state('value').length > 0).to.be.ok()
  });

  it('onItemHover', () => {
    const wrapper = mount(<CascadeSelect options={options} expandTrigger="hover" />);
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
    dropdownWrapper.find('li').at(0).simulate('mouseover');
    const option = dropdownWrapper.find('CascadeSubmenu').props().options[0];
    dropdownWrapper.find('CascadeSubmenu').props().onItemClick(option,2,false);
    expect(wrapper.state('value').length > 0).to.be.ok()
  });


  it('render sunmenus value renderArr', (done) => {
    const wrapper = mount(<CascadeSelect options={options} defaultValue={['alibaba', 'platform', 'fe']} />);
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
    const value = dropdownWrapper.find('CascadeSubmenu').props().value;
    expect(value.length).to.eql(dropdownWrapper.find('ul').nodes.length);
    done();
  });
});
