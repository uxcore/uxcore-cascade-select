import expect from 'expect.js';
import React from 'react';
import sinon from 'sinon';
import $ from 'jquery';
import Enzyme from 'enzyme';
import { render, findDOMNode, unmountComponentAtNode } from 'react-dom';
import Adapter from 'enzyme-adapter-react-15';
import CascadeSelect from '../src';
import { deepCopy } from '../src/util';
import { options, asyncOptions } from './options';

const { mount } = Enzyme;

Enzyme.configure({ adapter: new Adapter() });

const optionsGenerator = (key, level) => {
  const childrenOptions = [];
  for (let i = 0; i <= level; i += 1) {
    childrenOptions.push({
      label: `label-${key}-${i}`,
      value: `${key}-${i}`,
    });
  }
  return childrenOptions;
};

function noop () {}

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
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    expect(dropdownWrapper.length > 0).to.be.ok();
  });

  it('should have the defaultValue', () => {
    instance = render(<CascadeSelect options={options} defaultValue={['alibaba', 'platform', 'fe']} />, div);
    expect($(findDOMNode(instance)).find('.kuma-cascader-trigger').attr('title')).to.eql('阿里巴巴 / 信息平台 / 前端开发');
  });

  it('onChange should be called successfully', () => {
    const wrapper = mount(
      <CascadeSelect
        options={options}
        onChange={(value, selected) => {
          expect(value.length === selected.length).to.be.ok();
        }}
      />
    );
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    mount(dropdownWrapper.props().overlay).props().onItemClick();
  });

  it('should be disabled', () => {
    instance = render(<CascadeSelect options={options} disabled />, div);
    expect($(findDOMNode(instance))[0].className.indexOf('kuma-cascader-disabled') > -1).to.be.ok();
  });

  it('should be clearable', () => {
    const wrapper = mount(<CascadeSelect options={options} clearable />);
    wrapper.find('.kuma-icon-error').simulate('click');
    expect(wrapper.find('.kuma-cascader-placeholder').text()).to.eql('请选择');
  });

  it('expandTrigger', () => {
    const wrapper = mount(<CascadeSelect options={options} expandTrigger="hover" />);
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    expect(mount(dropdownWrapper.props().overlay).props().expandTrigger).to.eql('hover');
  });

  it('onItemClick', () => {
    const wrapper = mount(<CascadeSelect options={options} />);
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    mount(dropdownWrapper.props().overlay)
      .find('li')
      .at(0)
      .simulate('click');
    const option = mount(dropdownWrapper.props().overlay).props().options[0];
    mount(dropdownWrapper.props().overlay).props().onItemClick(option, 2, false);
    expect(wrapper.state('value').length > 0).to.be.ok();
  });

  it('onItemHover', () => {
    const wrapper = mount(<CascadeSelect options={options} expandTrigger="hover" />);
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    mount(dropdownWrapper.props().overlay)
      .find('li')
      .at(0)
      .simulate('mouseover');
    const option = mount(dropdownWrapper.props().overlay).props().options[0];
    mount(dropdownWrapper.props().overlay).props().onItemClick(option, 2, false);
    expect(wrapper.state('value').length > 0).to.be.ok();
  });

  it('render submenus value renderArr', (done) => {
    const wrapper = mount(<CascadeSelect options={options} defaultValue={['alibaba', 'platform', 'fe']} />);
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    const value = mount(dropdownWrapper.props().overlay).props().value;
    expect(value.length).to.eql(mount(dropdownWrapper.props().overlay).find('ul').length);
    done();
  });

  it('array contains single item as the value - case 1', (done) => {
    instance = render(<CascadeSelect options={options} value={['nanjinglu']} />, div);
    expect($(findDOMNode(instance)).find('.kuma-cascader-trigger').text()).to.eql('天津 / 和平区 / 南京路');
    done();
  });

  it('array contains single item as the value - case 2', (done) => {
    instance = render(<CascadeSelect options={options} value={['xicheng']} />, div);
    expect($(findDOMNode(instance)).find('.kuma-cascader-trigger').text()).to.eql('日本 / 西城');
    done();
  });

  it('displayMode select onChange', () => {
    const onChange = sinon.spy(noop);
    const wrapper = mount(
      <CascadeSelect
        value={['alibaba', 'platform', 'fe']}
        options={options}
        onChange={onChange}
        displayMode="select"
        isMustSelectLeaf
        getPopupContainer={(trigger) => trigger.parentNode}
      />
    );
    const select = mount(wrapper.find('Select').at(2).getElement());
    select.find('.kuma-select2').simulate('click');
    mount(select.find('Trigger').props().popup).find('li').at(1)
      .simulate('click');
    expect(onChange.calledOnce).to.be.ok();
  });

  it('Async CascadeSelect', (done) => {
    const wrapper = mount(
      <CascadeSelect
        options={deepCopy(asyncOptions)}
        value={['1', '1-1', '1-1-0']}
        onSelect={(resolve, reject, key, level) => {
          setTimeout(() => {
            resolve(optionsGenerator(key, level));
          }, 100);
        }}
      />
    );
    setTimeout(() => {
      expect($(wrapper.getDOMNode()).find('.kuma-cascader-trigger').attr('title')).to.be('1 / label-1-1 / label-1-1-0');
      done();
    }, 300);
  });

  it('Async CascadeSelect displayMode select', (done) => {
    const wrapper = mount(
      <CascadeSelect
        options={deepCopy(asyncOptions)}
        value={['1', '1-1', '1-1-0']}
        onSelect={(resolve, reject, key, level) => {
          setTimeout(() => {
            resolve(optionsGenerator(key, level));
          }, 100);
        }}
        displayMode="select"
      />
    );
    setTimeout(() => {
      expect($(wrapper.find('Select2').at(2).getDOMNode()).find('.kuma-select2-selection-selected-value')
        .text()).to.be('label-1-1-0');
      done();
    }, 300);
  });

  it('no miniMode', () => {
    const onChange = sinon.spy(noop);
    const wrapper = mount(
      <CascadeSelect
        defaultValue={['alibaba', 'platform', 'fe']}
        options={options}
        onChange={onChange}
        locale={'en_US'}
        miniMode={false}
      />
    );
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    const overlay = mount(dropdownWrapper.props().overlay);
    overlay.find('li').at(0).simulate('click');
    overlay.find('button').simulate('click');
    expect(onChange.calledOnce).to.equal(true);
  });

  it('displayMode is search, dropdown will display search result.', () => {
    const onChange = sinon.spy(noop);
    const wrapper = mount(
      <CascadeSelect
        options={options}
        onChange={onChange}
        locale={'en_US'}
        miniMode={false}
        displayMode="search"
        searchOption={{
          doSearch(keyword, afterSearch) {
            afterSearch([
              {
                label: 'test1',
                value: 'ID_TEST1',
              },
              {
                label: '前端开发',
                value: 'fe',
              },
              {
                label: 'test3 test3 test3 test3 test3 test3 test3 test3 test3 test3',
                value: 'ID_TEST3',
              },
            ]);
          },
        }}
      />
    );
    const dropdownWrapper = wrapper.find('Trigger');
    const overlay = mount(dropdownWrapper.props().overlay);
    const input = wrapper.find('input').getDOMNode();
    input.value = 'test';
    setTimeout(() => {
      const li = overlay.find('li').at(1);
      expect(li.text()).to.equal('前端开发');
      // overlay.find('li').at(1).simulate('click');
      // overlay.find('button').at(0).simulate('click');
      // expect(input.getDOMNode().value).to.equal('阿里巴巴 / 信息平台 / 前端开发');
    }, 200);
  });

  it('displayMode is search, click search result will get the real text.', () => {
    const onChange = sinon.spy(noop);
    const wrapper = mount(
      <CascadeSelect
        options={options}
        onChange={onChange}
        locale={'en_US'}
        miniMode={false}
        displayMode="search"
        searchOption={{
          doSearch(keyword, afterSearch) {
            afterSearch([
              {
                label: 'test1',
                value: 'ID_TEST1',
              },
              {
                label: '前端开发',
                value: 'fe',
              },
              {
                label: 'test3 test3 test3 test3 test3 test3 test3 test3 test3 test3',
                value: 'ID_TEST3',
              },
            ]);
          },
        }}
      />
    );
    const dropdownWrapper = wrapper.find('Trigger');
    const overlay = mount(dropdownWrapper.props().overlay);
    const input = wrapper.find('input').getDOMNode();
    input.value = 'test';
    setTimeout(() => {
      const li = overlay.find('li').at(1);
      li.simulate('click');
      setTimeout(() => {
        overlay.find('button').at(0).simulate('click');
        expect(input.getDOMNode().value).to.equal('阿里巴巴 / 信息平台 / 前端开发');
      }, 200);
    }, 200);
  });
});
