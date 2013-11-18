package com.prodigious.cqkb.taglib.osgi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.squeakysand.osgi.framework.BasicBundleActivator;

/**
 * Bundle activator for com.prodigious.cqkb - prodigious-cqkb-taglib.
 */
public class Activator extends BasicBundleActivator {

    private static final Logger LOG = LoggerFactory.getLogger(Activator.class);

    public Activator() {
		super(LOG);
	}

}
